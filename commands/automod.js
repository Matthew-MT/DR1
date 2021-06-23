const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const blk = require("../command_fragments/fragments_blacklist.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const blacklistF = compiler.compile({
    "add": blk.automodAdd,
    "delete": compiler.construct({
        "all": blk.automodClear,
        "default": blk.automodRemove
    }),
    "remove": blk.automodRemove,
    "clear": blk.automodClear,
    "view": blk.automodView,
    "list": blk.automodView
});

module.exports = {
    desc: "Edit automod settings for your server.",
    extra: "Subcommands:\n"
            + "#automod .add [sequences]:/n{Add sequences to the blacklist."
            + " To specify a custom command to execute when a word is matched, use \"<command:command>\","
            + " and to specify the permission level at which to ignore word matches, use \"<level:level>\".}\n"
            + "#automod .delete [sequences]:/n{Delete a set of sequences from the blacklist."
            + " Using \"automod delete all\" will clear the blacklist.}\n"
            + "#automod .remove:/n{Delete a set of sequences from the blacklist.}\n"
            + "#automod .clear:/n{Clear the blacklist.}\n"
            + "#automod .view|.list:/n{View all blacklisted sequences.}",
    default: 4,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await blacklistF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};