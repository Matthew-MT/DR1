const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const banF = require("../command_fragments/fragments_user.js").banMember;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Ban a user.",
    extra: "#ban [user] ([days of messages]) ([reason]):/n{Ban a user. If a number of days is specified, the user's messages over that many"
        + " days will be deleted as well. If a reason is specified, that reason will be DM'd to the member.}",
    default: Infinity,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await banF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};