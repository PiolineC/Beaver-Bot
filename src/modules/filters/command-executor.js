'use strict';
const Command = require('../command.js');
const Filter = require('../filter.js');
const ClassInstantiator = require('../../util/class-instantiator.js');

class CommandExecutor extends Filter {
    constructor(api, config) {
        super(api, config);            
        this.commands = ClassInstantiator.instantiate('./src/modules/commands', Command, [config]);
    }

    filter(msg) {
        if (!msg.body) return;
        const input = msg.body;       
        const prefix = this.config.prefix;
        if (!input.startsWith(prefix)) return;

        const cmd = input.split(' ')[0].slice(prefix.length); //command string
        const args = input.slice(cmd.length + prefix.length + 1); //input text excluding the command string         
        const thread = msg.threadID;

        for (let i of this.commands) {
            if (!i.trigger(msg, cmd)) continue;

            i.execute(msg, args)
                .then(output => { if (output) this.api.sendMessage(output, thread); })
                .catch(errMessage => this.api.sendMessage(errMessage, thread));
        }
    }
}

module.exports = CommandExecutor;
