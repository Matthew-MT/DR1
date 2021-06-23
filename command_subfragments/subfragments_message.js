const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {string} The name of the command used for the message. Throws false if the operation failed.
     */
    messageSet: function (serverData, command, type) {
        let found = serverData.customCommands[command];
        if (serverData.messages.hasOwnProperty(type) && found) {
            s.reference(found);
            serverData.messages[type] = found;
            return found.name;
        } else throw false;
    },
    /**
     * @returns {void} Throws false if there was no message to begin with.
     */
    messageDeset: function (serverData, type) {
        if (serverData.messages[type]) {
            s.dereference(serverData.messages[type]);
            serverData.messages[type] = null;
        } else throw false;
    },
};