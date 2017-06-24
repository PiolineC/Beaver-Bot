'use strict'
const Promise = require('bluebird');

class Command {
    constructor() {
        this.name = '';
        this.description = '';
        this.usage = '';
        this.help = '';
        this.subscribed = false;
    }

    execute(msg, input) {
        return Promise.reject();
    }

    trigger(cmd) {
        return false;
    }
}

module.exports = Command;
