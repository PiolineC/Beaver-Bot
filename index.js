'use strict';
//entry point for the API
const Promise = require('bluebird');
const login = Promise.promisify(require('facebook-chat-api'));
const config = require('./config.json');

//coverts the messenger API to promise-based
//we avoid using promisifyAll to maintain the original method naming scheme of the API
function promisifyAPI(api) {
    for (let i of Object.keys(api))
        api[i] = Promise.promisify(api[i]);
    return api;
}

function parseMessage(err, msg) {
    if (err) console.error(err);
    for (let f of filters)
        f.filter(msg);
}

// TODO: eventually add commandline parsing for chatIDs
const credentials = require('./login.json');
const loginOptions = {
    logLevel: 'info',
    selfListen: true,
};

const ClassInstantiator = require('./src/util/class-instantiator.js');
const Filter = require('./src/modules/filter.js');
let filters;

login(credentials, loginOptions)
    .then(promisifyAPI)
    .then(api => {
        filters = ClassInstantiator.instantiate('./src/modules/filters', Filter, [api, config]);
        api.listen(parseMessage);
    })
    .catch(console.error);
