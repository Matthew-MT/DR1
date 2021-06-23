const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const evt = require("../command_fragments/fragments_event.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const timeF = compiler.compile({
    "all": evt.viewEvents,
    "until": evt.viewEvent,
    "till": evt.viewEvent,
    "default": evt.viewEvent
});

module.exports = {
    desc: "Displays the time until an event starts. Create a new event with the event command.",
    extra: "{NOTE: Using \"time all\" will display the data for all current events.}",
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
        ), temp = await timeF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};