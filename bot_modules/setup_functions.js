const m = require("./dr1_modules.js");
const c = require("./constructors.js");
const v = require("./constants/values.js");

module.exports = {
    compiler: {
        /**
        * @param {Object}   choices         The next step of choices for this branch.
        * @param {Function} choices.default The default choice to execute when none others are matched.
        * @returns {Promise<{output: string; remainingInput: string; success: boolean}>}
        */
        compile: function (choices) {
            return async function (serverData, userData, channel, message, permissionData) {
                let temp = m.utility.inputGrab(userData), result,
                    found = m.utility.intelliMatch(temp.firstIndex, Object.keys(choices), serverData.permissions.intelligentMatching)[0];
                
                if (choices[found]) result = await choices[found](serverData, temp.remaining, channel, message, permissionData);
                if (!result && choices.default) result = await choices.default(serverData, userData, channel, message, permissionData);
                if (!result) result = new c.Res(
                    "Invalid subcommand.",
                    userData
                );
                return result;
            }
        },
        /**
         * @param {Object}   choices         The next step of choices for this branch.
         * @param {Function} choices.default The default choice to execute when none others are matched.
         */
        construct: function (choices) {
            return async function (serverData, userData, channel, message, permissionData) {
                let temp = m.utility.inputGrab(userData),
                    found = m.utility.intelliMatch(temp.firstIndex, Object.keys(choices), serverData.permissions.intelligentMatching)[0];
                
                if (found) result = await choices[found](serverData, temp.remaining, channel, message, permissionData);
                else if (choices.default) return await choices.default(serverData, userData, channel, message, permissionData);
                else return undefined;
            }
        },
        /**
         * @param {Object}   choices         The next step of choices for this branch.
         * @param {Function} choices.default The default choice to execute when none others are matched.
         * @param {number}   limit           The maximum number of command parameters to collect. Optional.
         * @param {Function} filter          A filter function that will end the collector once a value of false is returned. Optional.
         */
        collector: function (choices, limit = Infinity, filter, requireLimit = false) {
            return async function (serverData, userData, channel, message, permissionData) {
                let temp = m.utility.inputGrab(userData), collector = "", last = userData, num = 0, keys = Object.keys(choices),
                    found = m.utility.intelliMatch(temp.firstIndex, keys, serverData.permissions.intelligentMatching)[0];

                while (num++ < limit
                && temp.firstIndex
                && !choices[found]
                && (!filter || filter(temp.firstIndex, channel.guild))) {
                    if (temp.firstIndex.includes(" ")) temp.firstIndex = "\"" + temp.firstIndex + "\"";
                    collector += temp.firstIndex + " ";
                    last = temp.remaining;
                    temp = m.utility.inputGrab(temp.remaining);
                    found = m.utility.intelliMatch(temp.firstIndex, keys, serverData.permissions.intelligentMatching)[0];
                }
                if (requireLimit && num != limit) return undefined;
                if (choices[temp.firstIndex]) {
                    let res = await choices[temp.firstIndex](serverData, collector + temp.remaining, channel, message, permissionData);
                    return res;
                } else if (choices.default && (filter || num == limit)) {
                    let res = await choices.default(serverData, collector + last, channel, message, permissionData);
                    return res;
                } else return undefined;
            }
        },
        fallthrough: function (array, requireSuccess = false) {
            return async function (serverData, userData, channel, message, permissionData) {
                let res = undefined, i = 0, cmd;
                do {
                    cmd = array[i++];
                    if (cmd) res = await cmd(serverData, userData, channel, message, permissionData);
                    else res = undefined;
                }
                while (i < array.length && !res && (res.success || !requireSuccess));
                return res;
            }
        },
        /**
         * @param {Function} call              The function to attempt to execute using this pattern.
         * @param {Object[]} pattern           A pattern to follow.
         * @param {Function} pattern[].call    A function to check the provided input with. Interchangable with {@link pattern[].strings}
         * @param {string[]} pattern[].strings An array of strings to check for. Interchangable with {@link pattern[].call}
         * @param {number}   pattern[].limit   The number of command parameters to stop at with the current search term.
         */
        pattern: function (call, pattern, matchToEnd = true) {
            return function (serverData, userData, channel, message, permissionData) {
                let temp = m.utility.inputGrab(userData), index = 0, repeat;
                do {
                    if (!pattern[index].call(temp.firstIndex, channel.guild, repeat, serverData)
                    || !pattern.strings.includes(temp.firstIndex)
                    || repeat >= pattern[index].limit) {
                        index++;
                        repeat = 0;
                    } else repeat++;
                    temp = m.utility.inputGrab(temp.remaining);
                } while (index < pattern.length);
                if ((temp.remaining && matchToEnd) || index != pattern.length) return;
                else return call(serverData, userData, channel, message, permissionData);
            }
        },
        requiresCommandPermissions: function (fnc, command) {
            return async function (serverData, userData, channel, message, permissionData) {
                if (serverData.commandLevs.hasOwnProperty(command) && serverData.commandLevs[command] <= permissionData.executingAt) {
                    return await fnc(serverData, userData, channel, message, permissionData);
                } else return new c.Res(
                    permissionData.failMessage,
                    userData
                );
            }
        },
        bindToSender: function (fnc) {
            return async function (serverData, userData, channel, message, permissionData) {
                return await fnc(serverData, "<@!" + message.member.id + "> " + userData, channel, permissionData);
            }
        }
    },
    setup: {
        confirmByReactions: function (channel, serverData, rankRequired = Infinity) {
            if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return () => {return false;};
            return async function () {
                let msg = await channel.send("Are you sure?");
                var clearable = false;
                await msg.react("✅");
                await msg.react("❌");
                await msg.awaitReactions((reaction, user) => {
                    if (user.id == v.bots_DR1) return false;
                    let userRank = m.utility.getMemberRank(channel.guild.members.get(user.id), serverData);
                    if (reaction.emoji.name == "✅" && userRank >= rankRequired) {
                        clearable = true;
                        msg.delete();
                        return true;
                    } else if (reaction.emoji.name == "❌" && userRank >= rankRequired) {
                        clearable = false;
                        msg.delete();
                        return true;
                    }
                    return false;
                }, {max: 1, time: 300 * 1000});
                return clearable;
            }
        },
        newChannelDataIndex: function (serverData, channel, botMuteLevel = 0) {
            if (channel.id) return serverData.channels[channel.id] = new c.Channel(channel.id, botMuteLevel);
        },
        newMemberDataIndex: function (serverData, member, warnings = [], rankOffset = 0, xp = 0) {
            if (member.id) return serverData.members[member.id] = new c.Member(member.id, warnings, rankOffset, xp);
        },
        reference: function (command) {
            return ++command.reference;
        },
        dereference: function (command) {
            return (command.reference > 0) ? --command.reference : command.reference = 0;
        }
    },
    parser: {
        getIfUserID: function (input, guild) {
            return guild.users.get(input.match(/^<@!?(\d{17,18})>$/)[1] || input.match(/^\d{17,18}$/)[0]).id;
        },
        getIfChanID: function (input, guild) {
            return guild.channels.get(input.match(/^<#(\d{17,18})>$/)[1] || input.match(/^\d{17,18}$/)[0]).id;
        }
    }
}