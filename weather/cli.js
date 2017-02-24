#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

// meow let us access input values
const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

function _toCelcius(temp) {
    //converts temperature to celcius
	return Math.round(((temp - 32) * 5) / 9);
}

updateNotifier({ pkg}).notify();

weather(cli.input, (err, result) => {
	if (err) {
	
      // quit the app with an error msg
        console.log(chalk.bold.red(err));
		process.exit(1);
	}
    // after the query 
	let condition = result.query.results.channel.item.condition.text;
	let temperature;
    //choose if it is farenheit or celcius
	if (cli.input[2] && cli.input[2] === 'C') {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} else if (cli.input[2] && cli.input[2] === 'F') {
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else {
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}

	let city = cli.input[0] ? cli.input[0] : 'Dhaka';
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh';
    
    //prints the result
	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
