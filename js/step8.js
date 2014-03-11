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
	dv.draw.year();
	dv.get.data();
};

// Do these things once the data has been loaded
dv.setup.withData = function() {
	dv.setup.scales();
	dv.setup.axis();
	dv.draw.axis();
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

// Use the d3.svg.axis function to set up the axes to add
dv.setup.axis = function() {
	dv.axis.x = d3.svg.axis()
		.scale(dv.scale.x)
		.tickFormat(d3.format(',s'))
	;
	dv.axis.y = d3.svg.axis()
		.scale(dv.scale.y)
		.orient('left')
		.tickFormat(d3.format('n'))
	;
};


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

// Add the axes to the canvas
dv.draw.axis = function() {
	dv.svg.axis = {};

	dv.svg.axis.x = dv.svg.main.append('svg:g')
		.attr('class', 'axis')
		.attr('transform', 'translate(' + dv.opt.pad+ ',' + (dv.opt.h - dv.opt.pad) + ')')
		.call(dv.axis.x)
	;

	dv.svg.axis.y = dv.svg.main.append('svg:g')
		.attr('class', 'axis')
		.attr('transform', 'translate(' + dv.opt.pad + ',' + (-1 * dv.opt.pad) +')')
		.call(dv.axis.y)
	;
};

// Add the year to the canvas
dv.draw.year = function() {
	dv.svg.year = dv.svg.main.append('svg:text')
		.attr('id', 'year')
		.attr('dx', (dv.opt.pad + 10))
		.attr('dy', (dv.opt.h - (dv.opt.pad + 10)))
		.text(dv.state.year)
	;
};

/* UPDATE */

/* TO DO
	Add a property to dv.update called bubbles and set it equal to an anonymous function
		Inside this function, to dv.svg.bubbles chain a transition function and duration function with an argument of dv.opt.speed
		Syntax: dv.svg.bubbles.transition().duration(some duration in milliseconds)
		Now assuming we have changed dv.state.year somewhere else, set cx, cy, r and fill attributes of dv.svg.bubbles to the new values in the current year.
		Test this by going into the console, changing the dv.state.year to 2000 (from 1950) and then calling dv.update.bubbles();  You should see the bubbles transition smoothly to their new values.
*/

/* TO DO
	Add a property to dv.update called year and set it equal to an anonymous function
		Inside this function increment the current year by 1, check to see it's larger than dv.opt.year.end and set it to dv.opt.year.start
		To dv.svg.year chain a transition and a delay function with an argument of dv.opt.speed / 2
		Invoke dv.update.bubbles
*/

/* START */
dv.setup.start();