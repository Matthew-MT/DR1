const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;

module.exports = {
    desc: "Gives info about DR1.",
    extra: "",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        if (userData.match(/^latest\s+update$/)) return "```md\n" + require("../DR1.js").latestUpdate + "```";
        help.exe(serverData, message, "dr1");
        return;
        var data = m.utility.smartSplit(userData);
        if (data[0] == "help") {
            help.exe(message, serverData, commandName);
            return;
        }

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp;
    }
};