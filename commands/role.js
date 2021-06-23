const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const roleF = require("../command_fragments/fragments_user.js").toggleOwnRole;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Gives the user the requested role if it is available.",
    extra: "{To set which roles can be assigned via this command, use the \"rolesettings\" command.}",
    default: 0,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await roleF(serverData, userData, message.channel, message, permissionData)
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};