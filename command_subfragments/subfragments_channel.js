const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");

module.exports = {
    /**
     * @returns {number} Number of messages deleted. Throws false if the operation failed/no messages deleted.
     */
    channelPurge: async function (channel, userIDs = [], limit = 100) {
        let messages, collected = 0;
        try {messages = await channel.fetchMessages(200);} catch (err) {
            console.log(err);
            throw false;
        }
        if (userIDs.length) messages = messages.filter((msg) => {return userIDs.includes(msg.author.id);});
        messages = messages.filter(() => {return collected++ < limit;});
        let temp = (await channel.bulkDelete(messages)).size;
        if (temp) return temp;
        else throw false;
    },
    /**
     * @returns {number} The number of channels whose muted status has been changed. Throws false if none.
     */
    channelSetBotMute: function (serverData, guild, channels, botMuteLevel) {
        var channelCount = 0;
        for (var i = 0; i < channels.length; i++) if (guild.channels.get(channels[i])) {
            if (serverData.channels[channels[i].id]) {
                if (serverData.channels[channels[i].id].botMuteLevel != botMuteLevel) {
                    serverData.channels[channels[i].id].botMuteLevel = botMuteLevel;
                    channelCount++;
                }
            } else if (botMuteLevel != 0) {
                s.newChannelDataIndex(serverData, channels[i], botMuteLevel);
                channelCount++;
            }
        }
        if (channelCount) return channelCount;
        else throw false;
    },
    /**
     * @returns {string} The channel mentions of each channel with a bot mute. Throws false if none.
     */
    channelViewBotMutes: function (serverData, guild) {
        let output = "";
        for (const channel of Object.values(serverData.channels)) {
            if (!r.getChannel(channel.id, guild)) delete serverData.channels[channel.id];
            else if (channel.botMuteLevel) output += ((i == 0) ? "" : "\n") + "<#" + channel.id + ">: " + channel.botMuteLevel;
        }
        if (output) return output;
        else throw false;
    },
    /**
     * @returns {string} The type of special channel that has been set. Throws false if the operation failed.
     */
    channelSetSpecial: function (serverData, type, channel) {
        if (channel.guild.channels.get(channel.id)) {
            if (serverData.channels[channel.id] || s.newChannelDataIndex(serverData, channel)) {
                serverData.channels[channel.id].addSpecialProperty(type);
                return type;
            }
        } else throw false;
    },
    /**
     * @return {string} The type of special channel that has been deset. Throws false if the operation failed.
     */
    channelDesetSpecial: function (serverData, type, channel) {
        if (serverData.channels[channel.id] || s.newChannelDataIndex(serverData, channel)) {
            serverData.channels[channel.id].removeSpecialProperty(type);
            return type;
        }
    }
};