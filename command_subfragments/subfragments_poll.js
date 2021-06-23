const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {void} Throws false if poll creation was unsuccessful.
     */
    pollCreate: function (serverData, messageID, channelID, choices) {
        if (serverData.listeners.find((item) => {return (item.instance == "poll" && item.messageID == messageID);})) throw false;
        else return serverData.listeners.push(new c.Poll(messageID, channelID, choices));
    }
};