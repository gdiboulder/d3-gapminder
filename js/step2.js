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
	// Using the d3.csv function, get the data from 'data/gdp.csv'
	// Create a new variable 'myData' and set it equal to the data retrieved by the d3.csv function
	// Set dv.data.gdp equal to the data
	// console.log dv.data.gdp and myData inside the d3.csv function
	// console.log dv.data.gdp and myData outside and after the d3.csv function

dv.get.data = function() {
	d3.csv('SOME PATH', function(error, data) {
		var myData = SOME ARGUMENT;
		dv.data.gdp = SOME ARGUMENT;
		console.log('I am inside the d3.csv function.')
		console.log(THE DV VARIABLE);
		console.log(MY VARIABLE);
	});
	console.log('I am outside the d3.csv function.')
	console.log(THE DV VARIABLE);
	console.log(MY VARIABLE);
};

*/

//  Keep this stuff at the bottom of the file, we'll be updating it periodically

// This is all of the stuff we can do before we even have the data
dv.setup.withoutData = function() {
	dv.draw.main();
	// ADD AND UN-COMMENT ME!  I'M NEW!
	// dv.get.data();
};

// This kicks everything off
dv.setup.withoutData();