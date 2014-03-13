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

/* Step 1 Basic SVG
	// We need an SVG element in the DOM so we can append other SVG shapes and have them render properly (circles, lines, etc.)
	// Use the append function to add an SVG element to the main body
	// Use dv.opt.w and dv.opt.h for the height and width of the element

// This is the main svg object
dv.draw.main = function() {
	dv.svg.main = d3.select('CSS SELECTOR').append('svg:svg')
		.attr('ATTRIBUTE NAME', 'VALUE')
		.attr('ATTRIBUTE NAME', 'VALUE')
	;
};

//  Keep this stuff at the bottom of the file, we'll be updating it periodically

// This is all of the stuff we can do before we even have the data
dv.setup.withoutData = function() {
	dv.draw.main();
};

// This kicks everything off - keep this line at the bottom of the file
dv.setup.withoutData();

*/

