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

/* Step 2 Getting Data */
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

/* Step 3 Getting Lots of Data
	// 1. Comment out your first dv.get.data function (above)
	// Given the asynchronous nature of the data calls, one solution to getting data from multiple sources is to chain the calls together
	// 2. Create a separate function to get data from each of the following sources
	//	PATH					NAME
	//	'data/gdp.csv'			'gdp'
	//	'data/life.csv'			'life'
	//	'data/population.csv'	'population'
	//	'data/fertility.csv'	'fertility'

	// Make a call to dv.setup.massage, passing the data and the 'name' of the data
	// Call the next function at the end of the previous function
	// Call dv.setup.withData at the end of the last function
	// Call the first function from dv.get.data

dv.get.data() {
	dv.get.FIRST-NAME();	
};

dv.get.FIRST-NAME = function() {
	d3.csv('SOME PATH', function(error, data) {
		dv.setup.massage(DATA ARGUMENT, 'DATA NAME');
		dv.get.NEXT-NAME();
	});
};

dv.get.NEXT-NAME = function() {
	d3.csv('SOME PATH', function(error, data) {
		dv.setup.massage(DATA ARGUMENT, 'DATA NAME');
		dv.get.NEXT-NAME();
	});
};

dv.get.NEXT-NAME = function() {
	d3.csv('SOME PATH', function(error, data) {
		dv.setup.massage(DATA ARGUMENT, 'DATA NAME');
		dv.get.LAST-NAME();
	});
};

dv.get.LAST-NAME = function() {
	d3.csv('SOME PATH', function(error, data) {
		dv.setup.massage(DATA ARGUMENT, 'DATA NAME');
		dv.get.withData();
	});
};

*/

// ADD ME!  I'M NEW!
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


//  Keep this stuff at the bottom of the file, we'll be updating it periodically

// LOOK AT ME!  I'M NEW!
// This is all of the stuff we can only do AFTER we have the data 
dv.setup.withData = function() {
	console.log(dv.data);
};

// This is all of the stuff we can do before we even have the data
dv.setup.withoutData = function() {
	dv.draw.main();
	dv.get.data();
};

// This kicks everything off
dv.setup.withoutData();