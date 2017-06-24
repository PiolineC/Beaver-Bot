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
	}

	execute(msg) {
		if (this.subscribed) {
			if (msg.body != 'Pong!') {
				return super.execute();
			} else {
				console.log(msg)
				console.log("msg.timestamp is " + msg.timestamp);
				console.log("this.start is " + this.start);
				let timeTaken = parseInt(msg.timestamp) - this.start;
				let output = "Took " + timeTaken + " ms"
				this.start = -1;
				this.subscribed = false;
				return Promise.resolve(output);
			}
		} else {
			this.start = parseInt(msg.timestamp);
			this.subscribed = true;
			return Promise.resolve('Pong!');
		}
	}

	trigger(cmd) {
		return cmd === 'ping';
	}
}

module.exports = Ping;
