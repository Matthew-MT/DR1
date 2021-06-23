const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");
const v = require("../bot_modules/constants/values.js");
const cd = require("../bot_modules/cooldowns.js");
const us = require("../command_subfragments/subfragments_user.js");

const botKick = [
    "Haha. Nice try.",
    "I can kick you too if you want.",
    "Have I been a bad bot, ma?",
    "H-Hey! That tickles!",
    "Great. Now they're trying to kick machines to get them to work again.",
    "BEEP!",
    "What am I, the Millenium Falcon?",
    "If I were a bucket, you'd be dead."
];

const botSoftban = [
    "It seems you're going soft.",
    "It seems I'm going soft.",
    "Just like tissue paper.",
    "Where's DR1? Here it is! Where's DR1? **Here it is!**",
    "Peekaboo?",
    "I'll nab a ban. Which reminds me; I need to buy some bananas.",
    "Only hardcore gamers recieve a win screen. This isn't one of those cases.",
    "Are you fuzzy?"
];

const botBan = [
    "BANANA",
    "Ban ban ban, ban ban banan ♫",
    "I thought hammers were for nails.",
    "Since when do bots need to be banned?",
    "What do you call a group of raiders? A band...",
    "I'm apparently my own bane... ban, bane? Get it? Nevermind.",
    "PURGE THE FURRIES (not really)",
    "I love you too."
];

module.exports = {
    addRolesToOther: async function (serverData, userData, channel, message, permissionData) {
        if (!channel.guild.me.permissions.has("MANAGE_ROLES")) return new c.Res(
            "I do not have permission to manage member roles.",
            userData
        );
        let temp = m.utility.inputGrab(userData), role, roles = [];
        let member, members = [];
        try {
            do {
                member = r.getMember(temp.firstIndex, channel.guild);
                if (member) {
                    if (m.utility.getMemberRank(member, serverData) <= permissionData.executingAt) members.push(member);
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (member);
            let last = temp.remaining;
            do {
                role = r.getRole(temp.firstIndex, channel.guild);
                if (role) {
                    roles.push(role);
                    last = temp.remaining;
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (role);
            let output = "";
            if (!roles.length) return new c.Res(
                "No roles were specified.",
                userData
            );
            roles = roles.filter((item) => {return channel.guild.me.highestRole.position > item.position;});
            if (!roles.length) return new c.Res(
                "These roles are above my highest role.",
                userData
            );
            for (const item of members) {
                try {
                    let addableRoles = roles.filter((t) => {
                        return !item.roles.get(t.id);
                    });
                    if (!addableRoles.length) throw false;
                    await item.addRoles(addableRoles);
                    output += "\nAdded " + (addableRoles.length) + " roles to " + item.user.tag + ".";
                } catch (err) {if (err) console.log(err);}
            }
            if (!output) throw false;
            return new c.Res(
                "Roles added:" + output,
                last,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to add any roles.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    addRolesToSelf: async function (serverData, userData, channel, message) {
        if (!channel.guild.me.permissions.has("MANAGE_ROLES")) return new c.Res(
            "I am do not have permission manage member roles.",
            userData
        );
        let temp = m.utility.inputGrab(userData), role, roles = [], last = temp.remaining;
        try {
            do {
                role = r.getRole(temp.firstIndex, channel.guild);
                if (role) {
                    roles.push(role);
                    last = temp.remaining;
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (role);
            if (!roles.length) return new c.Res(
                "No roles were specified.",
                userData
            );
            roles = roles.filter((item) => {return channel.guild.me.highestRole.position > item.position;});
            if (!roles.length) return new c.Res(
                "These roles are above my highest role.",
                userData
            );
            roles = roles.filter((item) => {return !message.member.roles.get(item.id);});
            if (!roles.length) throw false;
            await message.member.addRoles(roles);
            return new c.Res(
                "Added " + roles.length + " roles.",
                last,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to add any roles.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    removeRolesFromOther: async function (serverData, userData, channel, message, permissionData) {
        if (!channel.guild.me.permissions.has("MANAGE_ROLES")) return new c.Res(
            "I am do not have permission manage member roles.",
            userData
        );
        let temp = m.utility.inputGrab(userData), role, roles = [];
        let member, members = [];
        try {
            do {
                member = r.getMember(temp.firstIndex, channel.guild);
                if (member) {
                    if (m.utility.getMemberRank(member, serverData) <= permissionData.executingAt) members.push(member);
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (member);
            let last = temp.remaining;
            do {
                role = r.getRole(temp.firstIndex, channel.guild);
                if (role) {
                    roles.push(role);
                    last = temp.remaining;
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (role);
            let output = "";
            if (!roles.length) return new c.Res(
                "No roles were specified.",
                userData
            );
            roles = roles.filter((item) => {return channel.guild.me.highestRole.position > item.position;});
            if (!roles.length) return new c.Res(
                "These roles are above my highest role.",
                userData
            );
            for (const item of members) {
                try {
                    let removeableRoles = roles.filter((t) => {
                        return item.roles.get(t.id);
                    });
                    if (!removeableRoles.length) throw false;
                    await item.removeRoles(removeableRoles);
                    output += "\nRemoved " + (removeableRoles.length) + " roles from " + item.user.tag + ".";
                } catch (err) {if (err) console.log(err);}
            }
            if (!output) throw false;
            return new c.Res(
                "Roles removed:" + output,
                last,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to remove any roles.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    removeRolesFromSelf: async function (serverData, userData, channel, message) {
        if (!channel.guild.me.permissions.has("MANAGE_ROLES")) return new c.Res(
            "I am do not have permission manage member roles.",
            userData
        );
        let temp = m.utility.inputGrab(userData), role, roles = [], last = temp.remaining;
        try {
            do {
                role = r.getRole(temp.firstIndex, channel.guild);
                if (role) {
                    roles.push(role);
                    last = temp.remaining;
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (role);
            if (!roles.length) return new c.Res(
                "No roles were specified.",
                userData
            );
            roles = roles.filter((item) => {return channel.guild.me.highestRole.position > item.position;});
            if (!roles.length) return new c.Res(
                "These roles are above my highest role.",
                userData
            );
            roles = roles.filter((item) => {return message.member.roles.get(item.id);});
            if (!roles.length) throw false;
            await message.member.removeRoles(roles);
            return new c.Res(
                "Removed " + (roles.length) + " roles.",
                last,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to remove any roles.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    toggleOwnRole: async function (serverData, userData, channel, message) {
        if (!channel.guild.me.permissions.has("MANAGE_ROLES")) return new c.Res(
            "I am do not have permission manage member roles.",
            userData
        );
        let temp = m.utility.inputGrab(userData);
        try {
            let role = r.getRole(temp.firstIndex, channel.guild),
                serverMember = serverData.members[message.member.id];
            if (role && serverMember && !serverMember.canAssignRole(serverData, role)) return new c.Res(
                "You don't have permission to assign this role.",
                userData
            );
            if (!role) return new c.Res(
                "Failed to find the specified role. Please try again.",
                userData
            );
            if (channel.guild.me.highestRole.position > role.position) {
                try {
                    await message.member.addRole(role);
                    return new c.Res(
                        "Role added!",
                        temp.remaining,
                        true
                    );
                } catch (err) {
                    if (!err) {
                        await message.member.addRole(role);
                        return new c.Res(
                            "Role removed!",
                            temp.remaining,
                            true
                        );
                    } else {
                        console.log(err);
                        throw err;
                    }
                }
            } else return new c.Res(
                "This role is above my highest role.",
                userData
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to toggle role.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    addWarning: function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let member = r.getMember(temp.firstIndex, channel.guild), last = temp.remaining;
            if (!member) return new c.Res(
                "Invalid member specified.",
                userData
            );
            temp = m.utility.inputGrab(temp.remaining);
            let decay = Number(temp.firstIndex);
            if (decay) last = temp.remaining;
            else decay = undefined;
            if (m.utility.getMemberRank(member, serverData) > permissionData.executingAt) return new c.Res(
                "You can't add a warning to a user whose rank is higher than yours (" + permissionData.executingAt + ").",
                userData
            );
            let reason = us.memberAddWarning(serverData, member, last, decay);
            if (reason) member.user.send("You were warned on **" + channel.guild.name + "** for:```" + reason + "```");
            else member.user.send("You have 1 new warning on **" + channel.guild.name + "**.");
            return new c.Res(
                "**" + member.user.tag + "** was warned for:```" + reason + "```",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to add a warning.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    clearWarnings: async function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let member = r.getMember(temp.firstIndex, channel.guild);
            if (!member) return new c.Res(
                "Invalid member specified.",
                userData
            );
            if (m.utility.getMemberRank(member, serverData) > permissionData.executingAt) return new c.Res(
                "You can't clear the warnings of a member whose rank is higher than your own (" + permissionData.executingAt + ")",
                userData
            );
            await us.memberClearWarnings(serverData, member, s.confirmByReactions(channel, serverData, permissionData.commandRank));
            return new c.Res(
                "Successfully cleared **" + member.user.tag + "**'s warnings.",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "No warnings were cleared.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    setRankOffset: function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let member = r.getMember(temp.firstIndex, channel.guild);
            temp = m.utility.inputGrab(temp.remaining);
            let rank = r.getPerm(temp.firstIndex);
            if (permissionData.executingAt != Infinity) return new c.Res(
                "Only administrators may set user rank offsets to prevent cheating of the rank system.",
                userData
            );
            return new c.Res(
                "Successfully set **" + member.user.tag + "**'s rank offset to " + us.memberSetRankOffset(serverData, member, rank) + ".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to set rank offset.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewRank: function (serverData, userData, channel) {
        let temp = m.utility.inputGrab(userData), member = r.getMember(temp.firstIndex, channel.guild);
        try {
            if (!member) throw false;
            let rank = us.memberViewRank(serverData, member), offset = us.memberViewRankOffset(serverData, member);
            return new c.Res(
                "**" + member.user.tag + "** has a rank of " + rank + " (base rank: " + (rank - offset) + "; offset: " + offset + ")",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to get member's rank.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewRankOffsets: function (serverData, userData, channel) {
        let output = "";
        try {
            for (const serverMember of Object.values(serverData.members)) try {
                let member = r.getMember(serverMember.id, channel.guild);
                if (member) {
                    let rank = us.memberViewRankOffset(serverData, member);
                    if (rank) output += "\n**" + member.user.tag + "** (" + member.id + "): " + rank;
                } else delete serverData.members[serverMember.id];
            } catch (err) {}
            if (!output) throw false;
            else output = output.slice(1);
            let pages = m.page.pagify(output, undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Current member rank offsets (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "No rank offsets found.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewRanks: function (serverData, userData, channel) {
        let output = "";
        try {
            for (const serverMember of Object.values(serverData.members)) try {
                let member = r.getMember(serverMember.id, channel.guild);
                if (member) {
                    let rank = us.memberViewRank(serverData, member);
                    if (rank) output += "\n**" + member.user.tag + "** (" + member.id + "): " + rank;
                } else delete serverData.members[serverMember.id];
            } catch (err) {}
            if (!output) throw false;
            else output = output.slice(1);
            let pages = m.page.pagify(output, undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Current member permission ranks (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "No ranks found.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    kickMember: async function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let member = r.getMember(temp.firstIndex, channel.guild);
            if (!member) return new c.Res(
                "Invalid member specified.",
                userData
            );
            if (member.id == v.bots_DR1) return new c.Res(
                botKick[Math.floor(Math.random() * botKick.length)],
                userData
            );
            if (member.id == message.member.id) return new c.Res(
                "You can't kick yourself.",
                userData
            );
            if (!member.kickable) return new c.Res(
                "I don't have permission to kick this member.",
                userData
            );
            if (permissionData.executingAt <= m.utility.getMemberRank(member, serverData)) return new c.Res(
                "You can't kick a member whose rank is equal to or higher than your own.",
                userData
            );
            try {await member.user.send("You were kicked from " + channel.guild.name
                + ((temp.remaining) ? "\nReason:\n" + temp.remaining : ""));} catch (err) {console.log(err);}
            member.kick((temp.remaining) ? temp.remaining : undefined);
            return new c.Res(
                "Successfully kicked **" + member.user.tag + "**.",
                "",
                true
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    softbanMember: async function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let member = r.getMember(temp.firstIndex, channel.guild);
            let days, expiration, last = temp.remaining;
            temp = m.utility.inputGrab(temp.remaining);
            if (temp.firstIndex.match(m.regex.num)) {
                days = Number(temp.firstIndex);
                last = temp.remaining;
                temp = m.utility.inputGrab(temp.remaining);
            } else days = 0;
            if (temp.firstIndex.match(m.regex.num)) {
                expiration = Number(temp.firstIndex);
                last = temp.remaining;
            } else expiration = 7;
            if (!member) return new c.Res(
                "Invalid member specified.",
                userData
            );
            if (member.id == v.bots_DR1) return new c.Res(
                botSoftban[Math.floor(Math.random() * botSoftban.length)],
                userData
            );
            if (member.id == message.member.id) return new c.Res(
                "You can't softban yourself.",
                userData
            );
            if (!member.bannable) return new c.Res(
                "I don't have permission to softban this member.",
                userData
            );
            if (permissionData.executingAt <= m.utility.getMemberRank(member, serverData)) return new c.Res(
                "You can't softban a member whose rank is equal to or higher than your own.",
                userData
            );
            try {await member.user.send("You were softbanned from " + channel.guild.name
                + ((last) ? "\nReason:\n" + last : ""));} catch (err) {console.log(err);}
            member.ban({days: days, reason: (last) ? last : undefined});
            cd.updateServerCooldown(serverData.softbans, member.id, {days: expiration});
            return new c.Res(
                "Successfully softbanned **" + member.user.tag + "**.",
                "",
                true
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    banMember: async function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let member = r.getMember(temp.firstIndex, channel.guild);
            let days, expiration, last = temp.remaining;
            temp = m.utility.inputGrab(temp.remaining);
            if (temp.firstIndex.match(m.regex.num)) {
                days = Number(temp.firstIndex);
                last = temp.remaining;
            } else days = 0;
            if (!member) return new c.Res(
                "Invalid member specified.",
                userData
            );
            if (member.id == v.bots_DR1) return new c.Res(
                botBan[Math.floor(Math.random() * botBan.length)],
                userData
            );
            if (member.id == message.member.id) return new c.Res(
                "You can't ban yourself.",
                userData
            );
            if (!member.bannable) return new c.Res(
                "I don't have permission to ban this member.",
                userData
            );
            if (permissionData.executingAt <= m.utility.getMemberRank(member, serverData)) return new c.Res(
                "You can't ban a member whose rank is equal to or higher than your own.",
                userData
            );
            try {await member.user.send("You were banned from " + channel.guild.name
                + ((last) ? "\nReason:\n" + last : ""));} catch (err) {console.log(err);}
            member.ban({days: days, reason: (last) ? last : undefined});
            return new c.Res(
                "Successfully banned **" + member.user.tag + "**.",
                "",
                true
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    viewMemberInfo: function (serverData, userData, channel) {
        let temp = m.utility.inputGrab(userData),
            member = r.getMember(temp.firstIndex);
        if (!member) return new c.Res(
            "No member specified.",
            userData
        );
        let serverMember = serverData.members[member.id];
        if (!serverMember) return new c.Res(
            "No data about this member is available.",
            userData
        );
        return new c.Res(
            "Rank: " + m.utility.getMemberRank(member, serverData) + "\n"
                + "Experience: " + serverMember.xp + "\n"
                + "Warnings: " + serverMember.warnings.length,
            temp.remaining,
            true
        );
    }
};