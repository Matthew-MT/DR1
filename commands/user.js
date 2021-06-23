const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const usr = require("../command_fragments/fragments_user.js");
const commandName = m.utility.extractName(module.filename);
const {compiler: compiler, parser: parser} = require("../bot_modules/setup_functions.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");
const userF = compiler.compile({
    "view": compiler.construct({
        "ranks": usr.viewRanks,
        "rank": compiler.construct({
            "offsets": usr.viewRankOffsets
        })
    }),
    "default": compiler.fallthrough([
        compiler.collector({
            "add": compiler.collector({
                "role": usr.addRolesToOther,
                "roles": usr.addRolesToOther,
                "warning": compiler.requiresCommandPermissions(usr.addWarning, "warn")
            }, 1, r.getMember),
            "remove": compiler.collector({
                "role": usr.removeRolesFromOther,
                "roles": usr.removeRolesFromOther
            }, 1, r.getMember),
            "set": compiler.collector({
                "rank": compiler.collector({
                    "offset": usr.setRankOffset,
                    "default": usr.setRankOffset
                }, 1, r.getMember),
                "default": usr.setRankOffset
            }, 1, r.getMember),
            "view": compiler.collector({
                "rank": usr.viewRank
            }, 1, r.getMember),
            "clear": compiler.collector({
                "warnings": usr.clearWarnings,
                "default": usr.clearWarnings
            }, 1, r.getMember),
            "warn": compiler.requiresCommandPermissions(usr.addWarning, "warn"),
            "kick": compiler.requiresCommandPermissions(usr.kickMember, "kick"),
            "softban": compiler.requiresCommandPermissions(usr.softbanMember, "softban"),
            "ban": compiler.requiresCommandPermissions(usr.banMember, "ban")
        }, 1, r.getMember),
        compiler.collector({
            "add": compiler.collector({
                "roles": usr.addRolesToOther,
                "default": usr.addRolesFromOther
            }, undefined, r.getMember),
            "remove": compiler.collector({
                "roles": usr.removeRolesFromOther,
                "default": usr.removeRolesFromOther
            }, undefined, r.getMember)
        }, undefined, r.getMember)
    ])
});

module.exports = {
    desc: "Perform an action on a user.",
    extra: "Subcommands:\n"
            + "#user [user] .view .rank:/n{View the rank offset of the given user.}\n"
            + "#user .view .ranks|<.rank .offsets>:/n{Using the ranks subcommand will show all non-zero ranks,"
            + " along with user tags and ids. The rank offsets subset will display all non-zero rank offsets,"
            + " again with user ids and tags.}\n"
            + "#user [user] .add .warning ([decay]) ([reason]):/n{Adds a warning to a user."
            + " Decay is the number of days for the warning to decay after. Default is the preset number in server settings.}\n"
            + "#user [user(s)] .add (.role|.roles) [roles]:/n{Adds all specified roles (by name or id)"
            + " to the given user(s) (by id) if possible.}\n"
            + "#user [user(s)] .remove (.role|.roles) [roles]:/n{Removes all specified roles (by name or id)"
            + " from the given users (by id) if possible.}\n"
            + "#user [user] .set (.level) (.offset) [level]:/n{Set a given user's level offset (Important note: offset)"
            + " to the specified value.}\n"
            + "#user [user] .clear (.warnings):/n{Clear a user's warnings.}\n"
            + "#user [user] .warn ([decay]) ([reason]):/n{Add a warning to a specified user."
            + " Decay is the number of days the warning will persist.}\n"
            + "#user [user] .kick ([reason]):/n{Kick a user.}\n"
            + "#user [user] .softban ([deleted messages]) ([days]) ([reason]):/n{Softban a user for a number of days."
            + " The number of days to delete messages over is given in the [deleted messages] parameter.}\n"
            + "#user [user] .ban ([deleted messages]) ([reason]):/n{Ban a user. Similar to softban but without an automatic unban.}",
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
        ), temp = await userF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};