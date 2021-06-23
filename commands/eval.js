const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const v = require("../bot_modules/constants/values.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const evalF = require("../command_fragments/fragments_!misc.js").evaluate;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Evaluate JavaScript.",
    extra: "{You may enclose your code within codeblocks (\`\`\`code\`\`\`), and even append the \"js\" tag if you wish."
        + " Please note: this command has been properly contained to prevent all possible ways of using it for malicious intent."
        + " Any attempt to do so will result in an error.}",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        if (message.author.id != v.users_Lord_Chaos) return "Command is closed to non-developers for the time being."; 

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await evalF(serverData, userData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};