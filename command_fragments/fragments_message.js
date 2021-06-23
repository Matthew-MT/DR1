const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const v = require("../bot_modules/constants/values.js");
const ms = require("../command_subfragments/subfragments_message.js");

module.exports = {
    setMessage: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData), type, command;
        try {
            type = v.messageTypes[temp.firstIndex];
            temp = m.utility.inputGrab(temp.remaining);
            command = serverData.customCommands[temp.firstIndex];
            if (type && command) return new c.Res(
                "Successfully set " + type + " message to the command " + ms.messageSet(serverData, command, type) + ".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to set " + type + " message.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    desetMessage: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData);
        try {
            ms.messageDeset(serverData, temp.firstIndex);
            return new c.Res(
                "Successfully deset " + temp.firstIndex + " message.",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to deset " + temp.firstIndex + " message.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    }
};