const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const pollF = require("../command_fragments/fragments_poll.js").createPoll;

module.exports = {
    desc: "Creates a poll.",
    extra: "",
    default: 2,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        var data = m.utility.smartSplit(userData);
        if (data[0] == "help") {
            help.exe(serverData, message, "poll");
            return;
        }

        let tempF = module.filename.match(/(\\|\/)([^\\/]*)/g), tempFN = tempF[tempF.length - 1];
        tempFN = tempFN.slice(1, tempFN.length - 3);
        let permissionData = new c.PermissionData(
            serverData.commandLevs[tempFN],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await pollF(serverData, userData, message.channel, message, permissionData)
        return temp.output;
    }
};