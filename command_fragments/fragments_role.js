const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");
const v = require("../bot_modules/constants/values.js");
const rl = require("../command_subfragments/subfragments_role.js");

module.exports = {
    setRolePermissions: function (serverData, userData, channel, message) {
        let temp = m.utility.inputGrab(userData), roles = [], role;
        try {
            do {
                role = (channel.guild.roles.get(m.utility.testAgainst(temp.firstIndex, v.numbers))
                    || channel.guild.roles.find((item) => {return item.name == temp.firstIndex;}));
                if (role) {
                    roles.push(role.id);
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (role);
            let rank = r.getPerm(temp.firstIndex), senderBaseRank = m.utility.getMemberRank(message.member, serverData, 0);
            if (rank > senderBaseRank) return new c.Res(
                "You can't set a permission rank higher than your base rank (" + senderBaseRank + ").",
                userData
            );
            if ((!rank && rank !== 0) || rank < 0) return new c.Res(
                "Invalid rank specified.",
                userData
            );
            return new c.Res(
                "Successfully set the permission rank for "
                    + rl.roleSetPermissionRank(serverData, roles, rank) + " role(s) to " + rank + ".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to set permission rank.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewRolePermissions: function (serverData, userData, channel) {
        try {
            let pages = m.page.pagify(rl.roleViewPermissionRank(serverData, channel.guild), undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Current role permission ranks (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to find any role permission ranks.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    setRoleAssignableRank: function (serverData, userData, channel, message) {
        let temp = m.utility.inputGrab(userData), roles = [], role;
        try {
            do {
                role = (channel.guild.roles.get(m.utility.testAgainst(temp.firstIndex, v.numbers))
                    || channel.guild.roles.find((item) => {return item.name == temp.firstIndex;}));
                if (role) {
                    roles.push(role.id);
                    temp = m.utility.inputGrab(temp.remaining);
                }
            } while (role);
            let rank = r.getPerm(temp.firstIndex), senderBaseRank = m.utility.getMemberRank(message.member, serverData, 0);
            if (rank > senderBaseRank) return new c.Res(
                "You can't set an assignable rank higher than your base rank (" + senderBaseRank + ").",
                userData
            );
            if ((!rank && rank !== 0) || rank < 0) return new c.Res(
                "Invalid rank specified.",
                userData
            );
            return new c.Res(
                "Successfully set the assignable rank for "
                    + rl.roleSetAssignableRank(serverData, roles, rank) + " role(s) to " + rank + ".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to set assignable rank.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewRoleAssignableRank: function (serverData, userData, channel) {
        try {
            let pages = m.page.pagify(rl.roleViewAssignableRank(serverData, channel.guild), undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Current assignable ranks (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to find any role assignable ranks.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    } 
};