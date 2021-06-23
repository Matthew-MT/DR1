const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const kickF = require("../command_fragments/fragments_user.js").kickMember;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Kick a user.",
    extra: "#kick [user] ([reason]):/n{Kick a user. If a reason is specified, it will be DM'd to the user on kick.}",
    default: 5,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await kickF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};