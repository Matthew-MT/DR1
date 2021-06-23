const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const r = require("../bot_modules/resolvables.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const chn = require("../command_fragments/fragments_channel.js");
const commandName = m.utility.extractName(module.filename);
const {compiler: compiler, parser: parser} = require("../bot_modules/setup_functions.js");
const channelF = compiler.compile({
    "view": compiler.construct({
        "mutes": chn.channelViewCommandMutes,
        "default": chn.channelViewCommandMutes
    }),
    "deset": chn.desetSpecialChannel,
    "purge": chn.channelDoPurge,
    "default": compiler.fallthrough([
        compiler.collector({
            "purge": chn.channelDoPurge,
            "set": compiler.collector({
                "mute": chn.channelsSetCommandMutes,
                "default": chn.setSpecialChannel
            }, 1, r.getChannel)
        }, 1, r.getChannel),
        compiler.collector({
            "set": compiler.collector({
                "mutes": chn.channelsSetCommandMutes
            }, undefined, r.getChannel)
        }, undefined, r.getChannel)
    ])
});

module.exports = {
    desc: "Performs an action on a channel.",
    extra: "Subcommands:\n"
            + "#channel .view (.mutes):/n{View the mute level of all channels. Excludes channels with a mute level of 0.}\n"
            + "#channel .deset [type]:/n{Deset a special channel type.}\n"
            + "#channel ([channel]) .purge ([users]) [amount]:/n{Purge a channel of the specified amount of messages."
            + " Default channel is the current channel. If users are specified (by id or mention), only their messages will be purged.}\n"
            + "#channel ([channel]) .set [type]|<.mute [level]>:/n{Without the mute subcommand, sets a special channel type."
            + " If instead the \"mute\" subcommand is added, a channel mute for the given channel is set.}\n"
            + "#channel ([channels]) .set .mutes [level]:/n{Sets the muted status for the given channels to the specified level.}",
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
        ), temp = await channelF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};