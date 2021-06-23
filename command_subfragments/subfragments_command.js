const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {number} The permission level the command has been set to. Throws false if the operation failed.
     */
    commandEditPerms: function (serverData, command, permissionLevel = Infinity) {
        const commands = require("../DR1.js").commands;
        if (commands[command]) return serverData.commandLevs[command] = permissionLevel;
        else if (serverData.customCommands[command]) return serverData.customCommands[command].permissionLevel = permissionLevel;
        else throw false;
    },
    /**
     * @returns {string} A list of command permissions for the given server.
     */
    commandViewPerms: function (serverData) {
        let commands = Object.keys(serverData.commandLevs), output = "";
        for (const command of commands) output += ((output) ? "\n" : "") + command + ": " + serverData.commandLevs[command];
        if (output) return output;
        else throw false;
    },
    /**
     * @returns {void} Throws false if operation failed.
     */
    commandCreate: function (serverData, command, executable, permissionLevel = Infinity, reference = 0) {
        if (!serverData.customCommands[command] && executable) {
            serverData.customCommands[command] = new c.Command(command, executable, permissionLevel, reference);
        } else throw false;
    },
    /**
     * @returns {void} Throws false if operation failed.
     */
    commandDelete: function (serverData, command) {
        if (serverData.customCommands.hasOwnProperty(command)) delete serverData.customCommands[command];
        else throw false;
    },
    /**
     * @returns {void} Throws false if operation failed.
     */
    commandClear: async function (serverData, confirm = () => {return true;}) {
        let keys = Object.keys(serverData.customCommands);
        if (keys.length && await confirm()) keys.forEach((key) => {delete serverData.customCommands[key];});
        else throw false;
    }
};