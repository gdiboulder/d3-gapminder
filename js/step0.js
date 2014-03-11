/* global d3 */

/* jshint devel:true */

/* TO DO
	Add a 'w' attribute to dv.opt and set the value to 700
	Add a 'h' attribute to dv.opt and set the value to 500
*/

// Establish the namespace and set some properties to help organize the code
var dv = {
	axis: {},
	data: {},
	draw: {},
	format: {},
	get: {},
	html: {},
	opt: {},
	setup: {},
	scale: {},
	state: {},
	svg: {},
	update: {}
};

/* SETUP */

// Start here with any setup that can be done before/while the data is being processed
dv.setup.start = function() {
	/* TO DO
		Execute the dv.draw.main function (once you have it written, or at least a placeholder)
	*/

};

/* GET */

/* DRAW */

/* TO DO
	Add a property to dv.draw called main and set it equal to an anonymous function
	Syntax: dv.draw.main = function() {};
		Inside this function use the append function to add an SVG element to the main body as dv.svg.main
		Use dv.opt.w and dv.opt.h for the height and width of the element
		Syntax: dv.svg.main = d3.select('something').append('something').attr('an attribute', 'a value');
*/

/* UPDATE */

/* START */
dv.setup.start();