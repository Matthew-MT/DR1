const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const lg = require("../command_subfragments/subfragments_log.js");

module.exports = {
    viewMessageLog: function (serverData, userData) {
        try {return new c.Res(
            "Message log:\n" + lg.logView(serverData),
            userData,
            true
        );} catch (err) {
            if (!err) return new c.Res(
                "No messages logged.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    clearMessageLog: function (serverData, userData) {
        try {
            lg.logClear(serverData);
            return new c.Res(
                "Cleared message log.",
                userData,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Log is already clear.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    }
};