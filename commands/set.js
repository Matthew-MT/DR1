const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const r = require("../bot_modules/resolvables.js");
const v = require("../bot_modules/constants/values.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const msc = require("../command_fragments/fragments_!misc.js");
const chn = require("../command_fragments/fragments_channel.js");
const cmd = require("../command_fragments/fragments_command.js");
const msg = require("../command_fragments/fragments_message.js");
const rle = require("../command_fragments/fragments_role.js");
const usr = require("../command_fragments/fragments_user.js");
const setF = compiler.compile({
    "server": compiler.requiresCommandPermissions(compiler.construct({
        "prefix": compiler.construct({
            "to": msc.setServerPrefix,
            "default": msc.setServerPrefix
        }),
        "visibility": compiler.construct({
            "to": msc.setServerVisibility,
            "default": msc.setServerVisibility
        })
    }), "server"),
    "channel": compiler.requiresCommandPermissions(compiler.construct({
        "mute": compiler.construct({
            "for": compiler.collector({
                "to": chn.channelsSetCommandMutes,
                "default": chn.channelsSetCommandMutes
            }, 1, r.getChannel),
            "default": compiler.collector({
                "to": chn.channelsSetCommandMutes,
                "default": chn.channelsSetCommandMutes
            }, 1, r.getChannel)
        }),
        "mutes": compiler.construct({
            "for": compiler.collector({
                "to": chn.channelsSetCommandMutes,
                "default": chn.channelsSetCommandMutes
            }, undefined, r.getChannel),
            "default": compiler.collector({
                "to": chn.channelsSetCommandMutes,
                "default": chn.channelsSetCommandMutes
            }, undefined, r.getChannel)
        }),
        "default": compiler.collector({
            "to": chn.setSpecialChannel
        }, 1, r.getChannel)
    }), "channel"),
    "command": compiler.requiresCommandPermissions(compiler.construct({
        "permissions": compiler.construct({
            "for": compiler.collector({
                "to": cmd.commandSetPerms
            }, 1, r.getCommand)
        }),
        "default": compiler.collector({
            "to": cmd.commandSetPerms
        }, 1, r.getCommand)
    }), "command"),
    "role": compiler.requiresCommandPermissions(compiler.construct({
        "permission": compiler.construct({
            "for": compiler.collector({
                "to": rle.setRolePermissions,
                "default": rle.setRolePermissions
            }, 1, r.getRole),
            "default": compiler.collector({
                "to": rle.setRolePermissions,
                "default": rle.setRolePermissions
            }, 1, r.getRole)
        }),
        "permissions": compiler.construct({
            "for": compiler.collector({
                "to": rle.setRolePermissions,
                "default": rle.setRolePermissions
            }, undefined, r.getRole),
            "default": compiler.collector({
                "to": rle.setRolePermissions,
                "default": rle.setRolePermissions
            }, undefined, r.getRole)
        }),
        "assugnable": compiler.construct({
            "rank": compiler.construct({
                "for": compiler.collector({
                    "to": rle.setRoleAssignableRank,
                    "default": rle.setRoleAssignableRank
                }, 1, r.getRole),
                "default": compiler.collector({
                    "to": rle.setRoleAssignableRank,
                    "default": rle.setRoleAssignableRank
                }, 1, r.getRole)
            }),
            "ranks": compiler.construct({
                "for": compiler.collector({
                    "to": rle.setRoleAssignableRank,
                    "default": rle.setRoleAssignableRank
                }, undefined, r.getRole),
                "default": compiler.collector({
                    "to": rle.setRoleAssignableRank,
                    "default": rle.setRoleAssignableRank
                }, undefined, r.getRole)
            })
        })
    }), "rolesettings"),
    "user": compiler.requiresCommandPermissions(compiler.construct({
        "offset": compiler.construct({
            "for": compiler.collector({
                "to": usr.setRankOffset,
                "default": usr.setRankOffset
            }, 1, r.getMember),
            "default": compiler.collector({
                "to": usr.setRankOffset,
                "default": usr.setRankOffset
            }, 1, r.getMember)
        })
    }), "user"),
    "default": compiler.fallthrough([
        compiler.collector({
            "message": compiler.requiresCommandPermissions(compiler.collector({
                "to": msg.setMessage,
                "default": msg.setMessage
            }, 1, (string) => {return v.messageTypes[string];}), "server")
        }, 1, (string) => {return v.messageTypes[string];})
    ])
});

module.exports = {
    desc: "An alternative way to set server settings.",
    extra: "Subcommands:\n"
        + "#set .server .prefix (.to) [value]:/n{Set your server's prefix to the specified string.}\n"
        + "#set .server .visibility (.to) [value]/n{Set the visibility of your server to true/false.}\n"
        + "#set .channel .mute(s) (.for) ([channel(s)]) (.to) [rank]:/n{Set the mute level of the specified channels to the given rank.}\n"
        + "#set .channel ([channel]) .to [type]:/n{Set the given channel to the specified type.}\n"
        + "#set .command .permissions .for [command] .to [rank]:/n{Set the permission level for the specified command to the given rank.}\n"
        + "#set .command [command] .to [rank]:/n{Same as above.}\n"
        + "#set .role .permission(s) (.for) [role(s)] (.to) [rank]:/n{Set a role or roles' permission rank to the given rank.}\n"
        + "#set .role .assignable .rank(s) (.for) [role(s)] (.to) [rank]:/n{Set a role or roles' assignable rank to the given rank.}\n"
        + "#set .user .offset (.for) [user] (.to) [offset]:/n{Set a user's offset to the specified rank.}\n"
        + "#set [type] .message (.to) [command]:/n{Set a specified message type to the given custom command.}",
    default: 0,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
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