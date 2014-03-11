/* global d3 */

/* jshint devel:true */

// Establish the namespace and set some properties to help organize the code
var dv = {
	axis: {},
	data: {
		sub: [],
		max: {}
	},
	draw: {},
	format: {},
	get: {},
	html: {},
	opt: {
		h: 500,
		w: 700,
		pad: 30,
		r: {
			min: 5,
			max: 50
		},
		fill: ["#0033CC", "#00CC33"],
		countries: ["Afghanistan","Argentina","Bangladesh","Canada","China","Egypt","Ethiopia","Greece","India","Iran","Nigeria","Russia","Saudi Arabia","Singapore","South Africa","United Kingdom","United States","Vietnam"],
		year: {
			start: 1950,
			end: 2012
		},
		speed: 750
	},
	setup: {},
	scale: {},
	state: {
		year: 1950
	},
	svg: {},
	update: {}
};

/* SETUP */

// Start here with any setup that can be done before/while the data is being processed
dv.setup.start = function() {
	dv.draw.main();
	dv.get.data();
};

// Do these things once the data has been loaded
dv.setup.withData = function() {
	dv.draw.bubbles();
};

/* TO DO
	Add a property to dv.setup called scales and set it equal to an anonymous function
		Inside this function, add a property to the dv.scale object for x and set it equal to a d3.scale.sqrt() function
		Set the domain from 0 to the maximum value of gdp, and the range from 0 to the width less 2 * dv.opt.pad
		Test this function in the console - the following statement should return 
		dv.scale.x(11000); // should return just over 301
		Add a scale for y using life as the domain (hint: what is different about the range for y in contrast to x?)
		dv.scale.y(56); // should return just over 200
		Add a scale for r (radius) using population as the domain, and dv.opt.r for the range
		Add a scale for fill using fertility as the domain and two colors as the range (e.g. ["#0033CC", "#00CC33"])
		Syntax:
			dv.scale.x = d3.scale.sqrt() or d3.scale.linear()
				.domain([start, end]) // these are smallest and largest values in your data set
				.range([start, end])  // these are smallest and largest values (usu. pixels) you are mapping the data to
		Be sure to call dv.setup.scales() from dv.setup.withData [hint: before or after dv.draw.bubbles?]
*/

/* GET */

// Collects the data
dv.get.data = function() {
	dv.state.loading = 4;
	for (var i = dv.opt.countries.length - 1; i >= 0; i--) {
		dv.data.sub[i] = { name: dv.opt.countries[i] };
	}
	dv.get.countryData({path: 'data/gdp.csv', name: 'gdp'});
	dv.get.countryData({path: 'data/life.csv', name: 'life'});
	dv.get.countryData({path: 'data/population.csv', name: 'population'});
	dv.get.countryData({path: 'data/fertility.csv', name: 'fertility'});
};

// expects opt.path and opt.name, adds the data to the dv.data object, massages the data, adds to dv.data.sub
dv.get.countryData = function(opt) {
	d3.csv(opt.path, function(error, data) {
		dv.data.max[opt.name] = 0;
		for (var i = data.length - 1; i >= 0; i--) {
			var country = data[i];
			var index = dv.opt.countries.indexOf(country.name);
			if (index !== -1) {
				dv.data.sub[index][opt.name] = {};
				for (var year = dv.opt.year.start; year <= dv.opt.year.end; year++) {
					var value = Number(country[year].replace(/,/g,''));
					dv.data.sub[index][opt.name][year] = value;
					if (value > dv.data.max[opt.name]) { dv.data.max[opt.name] = value; }
				}
			}
		}
		dv.data[opt.name] = data;
		dv.state.loading--;
		if (dv.state.loading === 0) { dv.setup.withData(); }
	});
};


/* DRAW */

// Main svg object
dv.draw.main = function() {
	dv.svg.main = d3.select('body').append('svg:svg')
		.attr('width', dv.opt.w)
		.attr('height', dv.opt.h)
	;
};

// Place the circles on the page
dv.draw.bubbles = function() {
	dv.svg.bubbles = dv.svg.main.append('svg:g').selectAll('circle')
		.data(dv.data.sub)
		.enter().append('svg:circle')
			.attr('cx', function(d,i){ return i*20; })
			.attr('cy', function(d,i){ return i*20; })
			.attr('r', 10)
	;
};

/* UPDATE */

/* START */
dv.setup.start();