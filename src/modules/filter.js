'use strict';

/**
* Base class for all filter modules.
*/
class Filter {
    /**
     * @param {Object} api Reference to the facebook api.
     * @param {Object} config Settings that get passed for the filter to use.
     */
    constructor(api, config) {
        this.api = api;
        this.config = config;
    }

    /**
     * Gets passed message objects for the filter to act on.
     *
     * @param {Object} msg The received message object. 
     */
    filter(msg) {}
}

module.exports = Filter;
