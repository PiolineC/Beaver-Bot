'use strict'
//entry point for the API
const Promise = require('bluebird');
const login = Promise.promisify(require('facebook-chat-api'));
const credentials = require('./config.json');
let apiX; //global reference  to api object

//initialize command modules
const CommandFinder = require("./src/core/discovery/command-finder.js");
const commandMap = CommandFinder.getCommands();


//attempt login
login(credentials)
    .then(promisifyAPI)
    .then(api => { 
        apiX = api; 
        //listen method is still callback based   
        api.listen(parseMessage)
    })
    .catch(console.error);

//coverts the messenger API to promise-based
//we avoid using promisifyAll to maintain the original method naming scheme of the API
function promisifyAPI(api) {
    for (let i of Object.keys(api)) 
        api[i] = Promise.promisify(api[i]);    
    return api;
}

function parseMessage(err, input) {    
    if (err) console.error(err);
    console.log(input);
    if (!input || !input.body) return;
    const thread = input.threadID;
    const msg = input.body;
    const cmd = msg.split(' ')[0].slice(1);
    
    for (let i of commandMap.values()) {
		if (i.trigger(cmd)) {
			return i.execute(msg)
				.then(output => apiX.sendMessage(output, thread));
		}
	}
}