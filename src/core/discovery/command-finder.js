'use strict'
const Command = require('../../modules/command.js');
const glob = require('glob');

class CommandFinder {
    constructor() {
        throw new Error('Do not instantiate CommandFinder.');
    }

    static getCommands() {
        return glob.sync('../../modules/commands/*.js', { cwd: __dirname })
            .map(path => require(path))
            .filter(mod => mod.prototype instanceof Command)
            .map(cmd => new cmd());
    }
}

module.exports = CommandFinder;
