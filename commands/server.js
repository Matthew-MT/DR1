const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const msg = require("../command_fragments/fragments_message.js");
const msc = require("../command_fragments/fragments_!misc.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const serverF = compiler.compile({
    "set": compiler.construct({
        "message": msg.setMessage,
        "prefix": msc.setServerPrefix,
        "visibility": msc.setServerVisibility,
        "default": msg.setMessage,
        "match": compiler.construct({
            "lenience": msc.setLenience
        })
    }),
    "deset": compiler.construct({
        "message": msg.desetMessage,
        "default": msg.desetMessage
    })
});
const custom = require("./command.js");

module.exports = {
    desc: "Enables server-wide settings to be changed, such as join/leave messages.",
    extra: "Subcommands:\n"
            + "#server .set (.message|.prefix|.visibility) [value]:/n{Message: value is the custom command to set the message to."
            + " Prefix: value is the prefix to set as the server's prefix."
            + " Visibility: value is true or false, true if you want the server to be visible to other servers"
            + " (which may allow others to access your server's invite through the bot if you've set it using this command)."
            + " Note: This action has a high cooldown.}\n"
            + "#server .set .match .lenience:/n{Set the lenience of intelligent string matching. A higher number means more lenience."
            + " Lenience 1 and above will allow case-insensitive matching, lenience 2 and above will allow \"switch characters\","
            + " a.k.a. 1337, to an extent while matching. Lenience 3 and above will allow \"vowel matching\","
            + " where vowels that replace other vowels and consonants that replace other consonants to be accounted in the search.}\n"
            + "#server .deset (.message):/n{Desets a message.}",
    default: 4,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await serverF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};