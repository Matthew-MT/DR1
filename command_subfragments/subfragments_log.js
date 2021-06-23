const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {string} A list of the messages logged by the automoderator since the last time the list was cleared. Throws false if none.
     */
    logView: function (serverData) {
        if (serverData.messageLog.length) return serverData.messageLog.join("\n");
        else throw false;
    },
    /**
     * @returns {void} Throws false if no messages have been logged.
     */
    logClear: function (serverData) {
        if (serverData.messageLog.length) serverData.messageLog.length = 0;
        else throw false;
    }
};