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
	dv.get.data();
};

// Do these things once the data has been loaded
dv.setup.withData = function() {
	console.log(dv.data);
};

/* GET */

// Collects the data
dv.get.data = function() {
	d3.csv('data/gdp.csv', function(error, data) {
		dv.data.gdp = data;
		dv.setup.withData();
	});

/* TO DO
	Add a property to dv.get called countryData and set it equal to an anonymous function that accepts a path (e.g. 'data/life.csv') and a name (e.g. 'life') as arguments
	Call that function a total of four times with the following arguments
	path: 'data/gdp.csv', name: 'gdp'
	path: 'data/life.csv', name: 'life'
	path: 'data/population.csv', name: 'population'
	path: 'data/fertility.csv', name: 'fertility'
	Cleanup: remove the call above to d3.csv for the gdp withData
	THE TRICKY PART: run dv.setup.withData just once, after all of the data is loaded
*/

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