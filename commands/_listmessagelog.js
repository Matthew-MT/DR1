const m = require("../bot_modules/dr1_modules.js");
const help = require("./help.js");

module.exports = {
    desc: "Lists the auto-deleted messages via DM from since last time the list was cleared.",
    extra: "",
    default: 3,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        var data = m.utility.smartSplit(userData);
        if (data[0] == "help") {
            help.exe(serverData, message, "listmessagelog");
            return;
        }
        
        var temp = "```";
        temp += serverData.messageLog[0];

        for (var i = 1; i < serverData.messageLog.length; i++) temp += ";\n" + serverData.messageLog[i];
        temp += "```";
        message.author.send(temp);
    }
};