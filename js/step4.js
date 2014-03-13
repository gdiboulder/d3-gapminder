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
		height: 500,
		width: 700,
		pad: 30,
		radius: {
			min: 5,
			max: 50
		},
		fill: ['#0033CC', '#00CC33'],
		countries: ['Afghanistan','Argentina','Bangladesh','Canada','China','Egypt','Ethiopia','Greece','India','Iran','Nigeria','Russia','Saudi Arabia','Singapore','South Africa','United Kingdom','United States','Vietnam'],
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

/* Step 1 Basic SVG */

// This is the main svg object
dv.draw.main = function() {
	dv.svg.main = d3.select('body').append('svg:svg')
		.attr('width', dv.opt.width)
		.attr('height', dv.opt.height)
	;
};

/* Step 2 Getting Data
dv.get.data = function() {
	d3.csv('data/gdp.csv', function(error, data) {
		var myData = data;
		dv.data.gdp = data;
		console.log('I am inside the d3.csv function.');
		console.log(dv.data.gdp);
		console.log(myData);
	});
	console.log('I am outside the d3.csv function.');
	console.log(dv.data.gdp);
	console.log(myData);
};
 */

/* Step 3 Getting Lots of Data */

// Collects the data
dv.get.data = function() {
	dv.get.gdp();
};

dv.get.gdp = function() {
	d3.csv('data/gdp.csv', function(error, data) {
		dv.setup.massage(data, 'gdp');
		dv.get.life();
	});
};

dv.get.life = function() {
	d3.csv('data/life.csv', function(error, data) {
		dv.setup.massage(data, 'life');
		dv.get.population();
	});
};

dv.get.population = function() {
	d3.csv('data/population.csv', function(error, data) {
		dv.setup.massage(data, 'population');
		dv.get.fertility();
	});
};

dv.get.fertility = function() {
	d3.csv('data/fertility.csv', function(error, data) {
		dv.setup.massage(data, 'fertility');
		dv.setup.withData();
	});
};

// Merges the data into a single array, cleans and converts csv strings to numbers, finds maximum values, restricts the data to the countries and time frame specified in dv.opt
dv.setup.massage = function(data, name) {
	var i;
	if (dv.data.sub.length === 0) {
		for (i = 0; i < dv.opt.countries.length; i++) {
			dv.data.sub[i] = { name: dv.opt.countries[i] };
		}
	}
	dv.data.max[name] = 0;
	for (i = 0; i < data.length; i++) {
		var country = data[i];
		var index = dv.opt.countries.indexOf(country.name);
		if (index !== -1) {
			dv.data.sub[index][name] = {};
			for (var year = dv.opt.year.start; year <= dv.opt.year.end; year++) {
				var value = Number(country[year].replace(/,/g,''));
				dv.data.sub[index][name][year] = value;
				if (value > dv.data.max[name]) { dv.data.max[name] = value; }
			}
		}
	}
};

/* Step 4 Adding SVG with Data
	Now that we have the data, we can actually draw some circles that visualization the data.  Let's start small...
	Create a function that adds a property to dv.svg called 'bubbles'
	Set it equal an svg:g element appended to the dv.svg.main
	Select all of the 'circle' elements
	Use the data method to connect those circles to dv.data.sub
	For each of those elements, append an svg:circle
	Using the .attr method, set the 'cx' attribute 
		console.log the 'd' argument
		return the life property of the data for the current year (dv.stat.year) * 10
	Set cy and radius = 10

// Place some circles on the page
dv.draw.bubbles = function() {
	dv.svg.bubbles = dv.svg.main.append('svg:SVG ELEMENT')
		.selectAll('SVG ELEMENT')
		.data(THE DATA)
		.enter().append('svg:SVG ELEMENT')
			.attr('cx', function(d, i) {
				console.log(i);
				console.log(d);
				return ARGUMENT.PROPERTY[dv.state.year] * 10;
			})
			.attr('cy', 10)
			.attr('r', 10)
	;
};
*/

//  Keep this stuff at the bottom of the file, we'll be updating it periodically

// This is all of the stuff we can only do AFTER we have the data 
dv.setup.withData = function() {
	// ADD AND UN-COMMENT ME!  I'M NEW!
	// dv.draw.bubbles();
};

// This is all of the stuff we can do before we even have the data
dv.setup.withoutData = function() {
	dv.draw.main();
	dv.get.data();
};

// This kicks everything off
dv.setup.withoutData();