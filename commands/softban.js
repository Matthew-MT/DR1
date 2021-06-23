const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const softbanF = require("../command_fragments/fragments_user.js").softbanMember;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Softbans a user.",
    extra: "#softban [user] ([days of messages]) ([decay]) ([reason])/n{Softban a user for a number of days given by [decay]"
        + " (Default is 7 days). The last days' worth of messages will be deleted as well if a number is specified."
        + " If a reason is specified, that reason will be DM'd to the member.}",
    default: 6,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await softbanF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};