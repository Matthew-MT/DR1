const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");
const v = require("../bot_modules/constants/values.js");
const ch = require("../command_subfragments/subfragments_channel.js");

module.exports = {
    channelDoPurge: async function (serverData, userData, channel) {
        try {
            let temp = m.utility.inputGrab(userData), foundChannel = r.getChannel(temp.firstIndex, channel.guild), members = [], member;
            if (foundChannel) temp = m.utility.inputGrab(temp.remaining);
            do {
                member = r.getMember(temp.firstIndex, channel.guild);
                if (member) {
                    members.push(member.id);
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (member);
            let limit = Number(temp.firstIndex);
            if (!limit || limit > 100 || limit < 0) return new c.Res(
                "Invalid limit specified.",
                userData
            );
            if (!channel.permissionsFor(channel.guild.me).has("MANAGE_MESSAGES")) return new c.Res(
                "I do not have permission to manage messages in this channel.",
                userData
            );
            return new c.Res(
                "Purged " + await ch.channelPurge(foundChannel || channel, members, limit)
                + " messages.",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Purge failed!",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    channelsSetCommandMutes: function (serverData, userData, channel, message, permissionData) {
        try {
            var channels = [], temp = m.utility.inputGrab(userData), channelID = "";
            while (channel.guild.channels.get(channelID = m.utility.testAgainst(temp.firstIndex, v.numbers))) {
                channels.push(channelID);
                temp = m.utility.inputGrab(temp.remaining);
            }
            let botMuteLevel, t = temp.firstIndex.toLowerCase();
            botMuteLevel = r.getPerm(t);
            if (!botMuteLevel && botMuteLevel !== 0) throw false;
            if (botMuteLevel > permissionData.executingAt) return new c.Res(
                "You can't set a mute at a rank higher than your own (" + permissionData.executingAt + ").",
                userData
            );
            return new c.Res(
                "Changed " + ch.channelSetBotMute(serverData, channels) + " command mute statuses.",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "No mute statuses set.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    channelViewCommandMutes: function (serverData, userData, channel) {
        try {
            let pages = m.page.pagify(ch.channelViewBotMutes(serverData, channel.guild), undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Current channel mute levels (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "There are no current command mutes.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    setSpecialChannel: function (serverData, userData, channel) {
        try {
            let temp = m.utility.inputGrab(userData);
            let type = temp.firstIndex;
            temp = m.utility.inputGrab(temp.remaining);
            let foundChannel = channel.guild.channels.get(m.utility.testAgainst(temp.firstIndex), v.numbers);
            return new c.Res(
                "Successfully set "
                    + ch.channelSetSpecial(serverData, type, foundChannel || channel) + " channel.",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to set " + type + " channel.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    desetSpecialChannel: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData);
        try {return new c.Res(
            "Successfully deset " + ch.channelDesetSpecial(serverData, temp.firstIndex) + " channel.",
            temp.remaining,
            true
        );} catch (err) {
            if (!err) return new c.Res(
                "Failed to deset " + temp.firstIndex + " channel.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    }
};