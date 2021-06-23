const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const purgeF = require("../command_fragments/fragments_channel.js").channelDoPurge;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Purges a specified number of messages in a channel.",
    extra: "#purge ([channel]) ([users]) [amount]:/n{Purges an amount of messages in the specified channel,"
        + " or the current channel if no channel is specified.}\n"
        + "{Behaves exactly like \"channel purge\".}",
    default: 3,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await purgeF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};