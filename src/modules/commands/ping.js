/*
Responds to a "ping" with a "pong". Useful to test the responsiveness of the bot.
*/

'use strict';
const Command = require('../command.js');
const Promise = require('bluebird');

class Ping extends Command {
	constructor() {
		super();
		this.name = 'ping';
		this.description = 'Responds with "Pong!"';
		this.help = 'Responds with "Pong!" and the time taken to execute the command.'
	}

	execute() {
		const start = process.hrtime();
		return Promise.resolve('Pong!')
			.then(output => { 
				const diff = process.hrtime(start); 
				return output + `\nTook ${diff[0]*1e3 + diff[1]/1e6} ms`;
			});
	}

	trigger(cmd) {
		return cmd === 'ping';
	}
}

module.exports = Ping;