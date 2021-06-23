const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const msc = require("../command_fragments/fragments_!misc.js");
const blk = require("../command_fragments/fragments_blacklist.js");
const chn = require("../command_fragments/fragments_channel.js");
const cmd = require("../command_fragments/fragments_command.js");
const evt = require("../command_fragments/fragments_event.js");
const log = require("../command_fragments/fragments_log.js");
const rle = require("../command_fragments/fragments_role.js");
const usr = require("../command_fragments/fragments_user.js");
const viewF = compiler.compile({
    "blacklist": compiler.requiresCommandPermissions(blk.automodView, "automod"),
    "channel": compiler.requiresCommandPermissions(compiler.construct({
        "mutes": chn.channelViewCommandMutes,
        "default": chn.channelViewCommandMutes
    }), "channel"),
    "command": compiler.requiresCommandPermissions(compiler.construct({
        "ranks": cmd.viewCommandPerms,
        "permissions": cmd.viewCommandPerms
    }), "command"),
    "commands": compiler.requiresCommandPermissions(cmd.viewCommandPerms, "command"),
    "event": compiler.requiresCommandPermissions(evt.viewEvent, "time"),
    "events": compiler.requiresCommandPermissions(evt.viewEvents, "event"),
    "role": compiler.requiresCommandPermissions(compiler.construct({
        "perms": rle.viewRolePermissions,
        "permissions": rle.viewRolePermissions,
        "assignable": compiler.construct({
            "ranks": rle.viewRoleAssignableRank
        })
    }), "rolesettings"),
    "user": compiler.requiresCommandPermissions(compiler.construct({
        "rank": usr.viewRank,
        "ranks": usr.viewRanks,
        "offsets": usr.viewRankOffsets
    }), "user"),
    "log": compiler.requiresCommandPermissions(log.viewMessageLog, "log"),
    "my": compiler.construct({
        "rank": compiler.bindToSender(usr.viewRank)
    }),
    "global": compiler.construct({
        "server": compiler.construct({
            "stats": msc.viewGlobalServerStats
        }),
        "command": compiler.construct({
            "stats": msc.viewGlobalCommandStats
        })
    })
});

module.exports = {
    desc: "A shortcut for viewing DR1 functions.",
    extra: "Subcommands:\n"
        + "#view .blacklist:/n{View the server's blacklist. Requires permission to use the \"automod\" command.}\n"
        + "#view .channel (.mutes):/n{View the current command mutes. Requires permission to use the \"channel\" command.}\n"
        + "#view .command(s) (.ranks):/n{View the current command ranks. Requires permission to use the \"command\" command.}\n"
        + "#view .event(s):/n{View an event or all current events. Requires permission to use the \"time\" command.}\n"
        + "#view .log:/n{View the current message log.}\n"
        + "#view .role <.perms|.permissions>|<.assignable .ranks>:/n"
        + "{View current role assignable ranks. Requires permission to use the \"rolesettings\" command.}\n"
        + "#view .user .rank|.ranks|.offsets:/n{View current user ranks/rank offsets. Requires permission to use the \"user\" command.}\n"
        + "#view .my .rank:/n{View your own rank. Does not require special permissions.}\n"
        + "#view .global .server .stats:/n{View the bot's global server stats."
        + " Can only be used if the server's visibility is set to true.}\n"
        + "#view .global .command .stats:/n{View global command usage.}",
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
        ), temp = await viewF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};