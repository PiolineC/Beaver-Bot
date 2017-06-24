/*
Responds to a "ping" with a "pong". Useful to test the responsiveness of the bot.
*/

'use strict';
const Command = require('../command.js');
const Promise = require('bluebird');

const name = 'ping';
const description = 'Responds with "Pong!"';
const help = 'Responds with "Pong!" and the time taken to execute the command.';

class Ping extends Command {
	constructor() {
		super(name, description, help);		
		this.start = -1;
		this.subscribed = false;
	}

	execute(msg) {
		let timestamp = msg.timestamp;
		if (this.subscribed) 
			return this.pong(timestamp);
		return this.ping(timestamp);		
	}
  
	trigger(msg, cmd) {
		if (this.subscribed)
			return msg.body === 'Pong!';
		return cmd === 'ping';
	}

	ping(timestamp) {		
		this.start = parseInt(timestamp);
		this.subscribed = true;
		return Promise.resolve('Pong!');
	}

	pong(timestamp) {
		let timeTaken = parseInt(timestamp) - this.start;
		let output = "Took " + timeTaken + " ms";
		this.start = -1;
		this.subscribed = false;
		return Promise.resolve(output);
	}
}

module.exports = Ping;
