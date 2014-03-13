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
// Place some circles on the page
dv.draw.bubbles = function() {
	dv.svg.bubbles = dv.svg.main.append('g')
		.selectAll('circle')
		.data(dv.data.sub)
		.enter().append('svg:circle')
			.attr('cx', function(d, i) {
				console.log(i);
				console.log(d);
				return d.life[dv.state.year] * 10;
			})
			.attr('cy', 10)
			.attr('r', 10)
	;
};
 */

/* Step 5 Scaling the Data */

// Scales to convert the data to values that can be used in the visualization
dv.setup.scales = function() {
	dv.scale.x = d3.scale.sqrt()
		.domain([0, dv.data.max.gdp])
		.range([0, dv.opt.width - dv.opt.pad * 2])
	;

	dv.scale.y = d3.scale.linear()
		.domain([0, dv.data.max.life])
		.range([dv.opt.height, dv.opt.pad * 2])
	;

	dv.scale.r = d3.scale.linear()
		.domain([0, dv.data.max.population])
		.range([dv.opt.radius.min, dv.opt.radius.max])
	;

	dv.scale.fill = d3.scale.linear()
		.domain([0, dv.data.max.fertility])
		.range(dv.opt.fill)
	;
};

// Place the circles on the page
dv.draw.bubbles = function() {
	dv.svg.bubbles = dv.svg.main.append('g')
		.selectAll('circle')
		.data(dv.data.sub)
		.enter().append('svg:circle')
			.attr('cx', function(d) { return dv.scale.x(d.gdp[dv.state.year]); })
			.attr('cy', function(d) { return dv.scale.y(d.life[dv.state.year]); })
			.attr('r', function(d) { return dv.scale.r(d.population[dv.state.year]); })
			.style('fill', function(d) { return dv.scale.fill(d.fertility[dv.state.year]); })
	;
};

/* Step 5 Freebies (Labeling the Chart) */
	// Nothing to fill in here, just add this stuff once you have the scales in

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

// Add the axes to the canvas
dv.draw.axis = function() {
	dv.svg.axis = {};

	dv.svg.axis.x = dv.svg.main.append('svg:g')
		.attr('class', 'axis')
		.attr('transform', 'translate(' + dv.opt.pad+ ',' + (dv.opt.height - dv.opt.pad) + ')')
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
		.attr('dy', (dv.opt.height - (dv.opt.pad + 10)))
		.text(dv.state.year)
	;
};


/* Step 6 Playing Through Time
	// When the year changes, the first thing we need to do is update the circles.
	//	This looks a lot like when we drew it the first time, with the addition of the transition and duration methods
	// We also need to update the Year label
	//	Use the text method to change the text to equal the new year
	// We're also going to add in a play/pause button to increment the years - you don't need to do any work to those

// Set the circle center, radius and fill to match the new year's values
dv.update.bubbles = function() {
	dv.svg.PROPERTY
		.transition().duration(OPTION)
		.attr('cx', function(d) { return SCALE(GDP-VALUE); })
		.attr('cy', function(d) { return SCALE(LIFE-VALUE); })
		.attr('r', function(d) { return SCALE(POPULATION-VALUE); })
		.style('fill', function(d) { return SCALE(FERTILITY-VALUE); })
	;
};

// Change the year label to match the current year
dv.update.year = function() {
	dv.svg.PROPERTY
		.transition().delay(dv.opt.speed / 2)
		.text(VALUE)
	;
};

// Increment the year by one, update the year text, and invoke dv.update.bubbles()
dv.update.incremental = function() {
	dv.state.year++;
	if (dv.state.year > dv.opt.year.end) {
		dv.state.year = dv.opt.year.start;
	}
	dv.update.year();
	dv.update.bubbles();
};

// Add the play button to the canvas
dv.draw.play = function() {
	dv.html.play = d3.select('body').append('html:div')
	.attr('class', 'controls')
	.append('html:text')
		.attr('onclick', 'dv.update.player()')
		.attr('class', 'button')
		.text('Play')
	;
};

// Toggle the value of the player and create or clear the timer as necessary
dv.update.player = function() {
	if (!dv.state.player) {
		dv.state.player = true;
		dv.html.play.text('Pause');
		dv.player = setInterval(dv.update.incremental, dv.opt.speed);
	} else {
		dv.state.player = false;
		dv.html.play.text('Play');
		clearInterval(dv.player);
	}
};
*/

//  Keep this stuff at the bottom of the file, we'll be updating it periodically

// This is all of the stuff we can only do AFTER we have the data 
dv.setup.withData = function() {
	dv.setup.scales();
	dv.setup.axis();
	dv.draw.axis();
	dv.draw.bubbles();
};

// This is all of the stuff we can do before we even have the data
dv.setup.withoutData = function() {
	dv.draw.main();
	dv.get.data();
	dv.draw.year();
	// ADD AND UN-COMMENT ME!  I'M NEW!
	// dv.draw.play();

};

// This kicks everything off
dv.setup.withoutData();