const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const log = require("../command_fragments/fragments_log.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const logF = compiler.compile({
    "view": log.viewMessageLog,
    "clear": log.clearMessageLog
});

module.exports = {
    desc: "Message log functions.",
    extra: "Subcommands:\n"
        + "#log .view:/n{View the current message log.}\n"
        + "#log .clear:/n{Clear the message log.}",
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
        ), temp = await logF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};