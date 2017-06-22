'use strict'
//entry point for the messenger API
const Promise = require('bluebird');
const login = Promise.promisify(require('facebook-chat-api'));
const credentials = require('./config.json');

login(credentials)
    .then(api => {
        console.log('Hello world!~');
    })
    .catch(console.error);
