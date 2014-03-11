/* global d3 */

/* jshint devel:true */

/* TO DO
	Replace dv with the following:
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
*/

// Establish the namespace and set some properties to help organize the code
var dv = {
	axis: {},
	data: {},
	draw: {},
	format: {},
	get: {},
	html: {},
	opt: {
		w: 800,
		h: 600
	},
	setup: {},
	scale: {},
	state: {},
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
	console.log(dv.data);
};

/* GET */

// Collects the data
dv.get.data = function() {
	dv.state.loading = 4;
	/* TO DO
		For each item in the dv.opt.countries array, add a property to the dv.data.sub object and set the value to an array, with a single property of 'name' and set that equal to the country name
		Hint:
			for (var i = length of dv.opt.countries - 1; i >= 0; i--) {
				dv.data.sub[i] = { name: the current item in dv.opt.countries};
			}
	*/

	dv.get.countryData({path: 'data/gdp.csv', name: 'gdp'});
	dv.get.countryData({path: 'data/life.csv', name: 'life'});
	dv.get.countryData({path: 'data/population.csv', name: 'population'});
	dv.get.countryData({path: 'data/fertility.csv', name: 'fertility'});
};

// expects opt.path and opt.name, adds the data to the dv.data object
dv.get.countryData = function(opt) {
	d3.csv(opt.path, function(error, data) {
		/* TO DO
			Go through each item in the data array, add only those countries and years specified in dv.opt to the dv.data.sub array
			Convert all of the numeric values to numbers (remove commas, convert from string to number)
			Figure out the maximum value for each data set
			NOTE: I wasn't kidding about this taking forever to work out. So feel free to attempt it on your own, or spend the time to try to understand my solution below.  It probably isn't most elegant solution, but it gets the job done.
			SPOILER ALERT: 
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
		*/

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

/* UPDATE */

/* START */
dv.setup.start();