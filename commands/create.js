const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const cmd = require("../command_fragments/fragments_command.js");
const evt = require("../command_fragments/fragments_event.js");
const pll = require("../command_fragments/fragments_poll.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const createF = compiler.compile({
    "command": cmd.createCommand,
    "event": evt.createEvent,
    "poll": pll.createPoll
});

module.exports = {
    desc: "An alternative way to create DR1 feature instances, such as events or custom commands.",
    extra: "Subcommands:\n"
        + "#create .command [executable]:/n{Create a new custom command.}\n"
        + "#create .event [data]:/n{Create a new event.}\n"
        + "#create .poll [choices]:/n{Create a new poll.}",
    default: 4,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        return "Unfortunately this command is under development. Please wait.";

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await createF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};