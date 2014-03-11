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
	dv.setup.scales();
	dv.draw.bubbles();
};

// Scales to convert the data to values that can be used in the visualization
dv.setup.scales = function() {
	dv.scale.x = d3.scale.sqrt()
		.domain([0, dv.data.max.gdp])
		.range([0, dv.opt.w - dv.opt.pad * 2])
	;

	dv.scale.y = d3.scale.linear()
		.domain([0, dv.data.max.life])
		.range([dv.opt.h, dv.opt.pad * 2])
	;

	dv.scale.r = d3.scale.linear()
		.domain([0, dv.data.max.population])
		.range([dv.opt.r.min, dv.opt.r.max])
	;

	dv.scale.fill = d3.scale.linear()
		.domain([0, dv.data.max.fertility])
		.range(dv.opt.fill)
	;
};

/* TO DO
	Add a property to dv.setup called axis and set it equal to an anonymous function
		Inside this function, add a property to dv.axis called x and set it equal to a d3.svg.axis function
		Set the scale method argument to dv.scale.x, and the tickFormat method argument to d3.format(',s')
		Syntax: d3.svg.axis().scale(some scale).tickFormat(some format)
		Do the same for the y axis 
	Call dv.setup.axis from dv.setup.withData
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
	dv.svg.bubbles = dv.svg.main.append('g')
		.selectAll('circle')
		.data(dv.data.sub)
		.enter().append('svg:circle')
			.attr('cx', function(d){ return dv.scale.x(d.gdp[dv.state.year]); })
			.attr('cy', function(d){ return dv.scale.y(d.life[dv.state.year]); })
			.attr('r', function(d){ return dv.scale.r(d.population[dv.state.year]); })
			.style('fill', function(d){ return dv.scale.fill(d.fertility[dv.state.year]); })
	;
};

/* TO DO
	Add a property to dv.draw called axis and set it equal to an anonymous function
		Inside this function, add an axis property to dv.svg and set it equal to an empty object
		Add an x property to dv.svg.axis and set it equal to an svg:g appended on to dv.svg.main
			Give it a css class of 'axis'
			Translate it to the right by dv.opt.pad, and down to the bottom of the svg canvas
			Syntax: .attr('transform','translate(some amount right, some amount down)
			Note: if you are using variables (which you will be) you'll have to end quote, then concatenate the variable, and begin quotes again:
			Syntax: .attr('transform','translate(' + some variable + ',' + some variable + ')')
			finally, invoke the call method and pass dv.axis.x as an argument
		Do the same for the y axis
	Call dv.draw.axis from a suitable location
*/

/* TO DO
	Add yet another property to draw called year and set it equal to an anonymous function
		Inside this function, add a year property to dv.svg and set it equal to an svg:text appended on to dv.svg.main
		Add an id attribute and set it equal to 'year'
		Position it at the bottom left corner of the canvas, shifted to the right and up (dv.opt.pad + 10)
	Don't forget to call this function from either dv.setup.start or dv.setup.withData
	Hint: 

/* UPDATE */


/* START */
dv.setup.start();