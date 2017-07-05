'use strict';
const glob = require('glob');

class ClassInstantiator {
    constructor() {
        throw new Error('Do not instantiate ClassInstantiator.');
    }

    static instantiate(directory, parent, args) { 
        return glob.sync(`${process.cwd()}/${directory}/*.js`)
            .map(path => require(path))
            .filter(child => child.prototype instanceof parent)
            .map(theClass => new theClass(...args));
    }
}

module.exports = ClassInstantiator;
