/* global d3 */

/* jshint devel:true */

// Establish the namespace and set some properties to help organize the code
var dv = {
	axis: {},
	data: {},
	draw: {},
	format: {},
	get: {},
	html: {},
	opt: {
		h: 500,
		w: 700
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
};

/* TO DO
	Add a property to dv.setup called withData and set it equal to an anonymous function
	Syntax: dv.setup.withData = function() { do something; }
		Inside this function, console.log() dv.data
		Syntax: console.log(something);
*/

/* GET */

/* TO DO
	Add a property to dv.get called data and set it equal to an anonymous function
	Call this function from inside dv.setup.start
	Syntax: dv.get.data = function() { do something; }
		Inside this function, load 'data/gdp.csv' into dv.data.gdp
		Syntax: d3.csv('path', function(error,data){ do stuff; });
		call dv.setup.withData when you're done
*/


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