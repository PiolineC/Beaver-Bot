'use strict'
//entry point for the API
const Promise = require('bluebird');
const login = Promise.promisify(require('facebook-chat-api'));
const credentials = require('./login.json');
let apiX; //global reference  to api object

//initialize command modules
const CommandFinder = require("./src/core/discovery/command-finder.js");
const commands = CommandFinder.getCommands();


//coverts the messenger API to promise-based
//we avoid using promisifyAll to maintain the original method naming scheme of the API
function promisifyAPI(api) {
    for (let i of Object.keys(api))
        api[i] = Promise.promisify(api[i]);
    return api;
}

function parseMessage(err, msg) {
    if (err) console.error(err);
    console.log(msg)
    if (!msg.body) return;
    const input = msg.body;
    const cmd = input.split(' ')[0].slice(1); //command string
    const args = input.slice(input.indexOf(' ') + 1); //input text excluding the command string
    const thread = msg.threadID;

    for (let i of commands) {
        if (!i.trigger(cmd) && !i.subscribed) continue;
        i.execute(msg, args)
            .then(output => { if (output) apiX.sendMessage(output, thread) })
            .catch(errMessage => apiX.sendMessage(errMessage, thread));
    }
}


// XXX eventually add commandline parsing for chatIDs
let loginOptions = {
    logLevel: 'info',
    selfListen: true,
    // pageID: 1774234042601695
}

login(credentials, loginOptions)
    .then(promisifyAPI)
    .then(api => {
        apiX = api;
        api.listen(parseMessage)
    })
    .catch(console.error);
