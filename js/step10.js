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
	dv.draw.play();
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


/* TO DO
	Add a format property to dv.setup and set it equal to an anonymous function
		Inside this function, add three properties to dv.format
		I'm not sure it makes sense to create an exercise out of this - I find the d3.format function to be somewhat obtuse
		Feel free to go check out the documentation, but what we're doing is creating some formatters to make different kinds of numbers human readable
		Specifically dollar values (GDP), simple decimal values (life expectancy) and big numbers (population) easy to read
		Spoiler Alert:
			dv.setup.format = function() {
				dv.format.dollar = d3.format('$,.0f');
				dv.format.fix1 = d3.format('.1f');
				dv.format.big = d3.format(',.3r');
			};
		Don't forget to call this function from one of the dv.setup functions
*/

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
			/* TO DO
				Chain the 'on' method and pass as arguments 'mouseover' and an anonymous function that calls dv.update.hover.show and passes 'd' as an argument
				Chain it again and pass mouseout and call dv.update.hover.hide
			*/
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

dv.draw.play = function() {
	dv.html.play = d3.select('body').append('html:div')
	.attr('class', 'controls')
	.append('html:text')
		.attr('onclick', 'dv.update.player()')
		.attr('class', 'button')
		.text('Play')
	;
};

/* TO DO

	Add a new property to dv.draw called hover and set it equal to an anonymous function
		Inside this function, add a property to dv.html called hover and set it equal to an empty object
		Add a 'main' property to dv.html.hover and set it equal to an html:div append to body, and give it an id of hover
		
		Add a country property set it equal to an html:div append to dv.html.hover.main 
		Append a span to that div with a class of value
		
		Add a gdp property set it equal to an html:div append to dv.html.hover.main 
		Append a span to that div with a class of value
		Append a span to that gdp div with a class of descr and a text of ' per capity GDP'

		Do the same for population but make the text in the description ' total population'
		Do the same for life, but make the text ' years life expectancy'
		Do the same for fertility, but make the text ' children per woman'

		Feel free to create a function to avoid some of the repetition
	Don't forget to call this function from setup!
*/

/* UPDATE */

// Set the circle center, radius and fill to match the new year's values
dv.update.bubbles = function() {
	dv.svg.bubbles
		.transition().duration(dv.opt.speed)
		.attr('cx', function(d){ return dv.scale.x(d.gdp[dv.state.year]); })
		.attr('cy', function(d){ return dv.scale.y(d.life[dv.state.year]); })
		.attr('r', function(d){ return dv.scale.r(d.population[dv.state.year]); })
		.style('fill', function(d){ return dv.scale.fill(d.fertility[dv.state.year]); })
	;
};

// Increment the year by one, update the year text, and invoke dv.update.bubbles()
dv.update.year = function() {
	dv.state.year++;
	if (dv.state.year > dv.opt.year.end) {
		dv.state.year = dv.opt.year.start;
	}

	dv.svg.year
		.transition().delay(dv.opt.speed / 2)
		.text(dv.state.year)
	;

	dv.update.bubbles();
};

// Toggle the value of the player and create or clear the timer as necessary
dv.update.player = function() {
	if (!dv.state.player) {
		dv.state.player = true;
		dv.html.play.text('Pause');
		dv.player = setInterval(dv.update.year, dv.opt.speed);
	} else {
		dv.state.player = false;
		dv.html.play.text('Play');
		clearInterval(dv.player);
	}
};

/* TO DO
	Add a new property to dv.update called hover and set it equal to an empty object
	Add a new property to dv.update.hover called show and set it equal to an anonymous function with (d) as an argument
		Inside this function, invoke the style() method and pass it 'left' and d3.event.pageX + 10 + 'px' as the arguments
		Invoke it again and pass it top and the d3.event
		Invoke it one last time to set the opactity to 0.8

		Now set the text of each of the .value fields in the hover to reflect the value of the country currently being hovered
		Syntax: dv.html.hover.something.select(something)text(d.something)
		After doing this for all of the fields look at it in the browser
		Now for each of the values, select an appropriate dv.format and pass it the value

	Add a new property to dv.update.hover called hide and set it equal to an anonymous function
		Inside this function set the opacity of the hover to 0
*/


/* START */
dv.setup.start();