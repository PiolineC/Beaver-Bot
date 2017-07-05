'use strict';
const Promise = require('bluebird');

/**
* Base class for all command modules.
*/
class Command {
    /**
     * @param {String} name Name of the command.
     * @param {String} description Terse description of the command.
     * @param {String} help Help text to provide additional clarity on how to use the command.
     * @param {String} usage Text that explains the arguments the command takes.
     */
    constructor(name, description, help, usage) {
        this.name = name;
        this.description = description;
        this.help = help;
        this.usage = usage;
    }

    /**
     * Primary function of the command. Invoked if trigger returns true.
     *
     * @param {Object} msg The received message object.
     * @param {String} args Text of the command minus the command string itself.
     *
     * @return {Promise} Optional return output. If resolved, results in the bot printing the output.
     * If rejected, results in the bot printing an error message.
     */
    execute(msg, args) {
        return Promise.reject();
    }

    /**
     * Determines the condition(s) this module acts on.
     *
     * @param {Object} msg The received message object.
     * @param {String} cmd Command string being validated.
     *
     * @return {Boolean} Returns true if the command should be executed, otherwise false.
     */
    trigger(msg, cmd) {
        return false;
    }
}

module.exports = Command;
