/*
Responds to a "ping" with a "pong". Useful to test the responsiveness of the bot.
*/

'use strict';
const Command = require('../command.js');
const Promise = require('bluebird');

const name = 'ping';
const description = 'Responds with "pong"';
const help = 'Responds with "pong" and the time taken to process the command.';

class Ping extends Command {
    constructor(config) {
        super(name, description, help);   
        this.config = config;     
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
            return cmd === 'pong' && msg.senderID === this.config.id;        
        return cmd === 'ping';
    }

    ping(timestamp) {        
        this.start = parseInt(timestamp);
        this.subscribed = true;
        return Promise.resolve(`${this.config.prefix}pong`);
    }

    pong(timestamp) {
        let timeTaken = parseInt(timestamp) - this.start;
        let output = `Took ${timeTaken} ms`;
        this.start = -1;
        this.subscribed = false;
        return Promise.resolve(output);
    }
}

module.exports = Ping;
