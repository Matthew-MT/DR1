const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {number} The number of roles added to the user.
     */
    memberAddRoles: async function (member, roleIDs) {
        var rolesAdded = 0;
        for (var i = 0; i < roleIDs.length; i++) try {
            if (member.guild.me.highestRole.position > member.guild.roles.get(roleIDs[i]).positon && !member.roles.get(roleIDs[i])) {
                await member.addRole(member.guild.roles.get(roleIDs[i]));
                rolesAdded++;
            }
        } catch (err) {console.log(err);}
        if (rolesAdded) return rolesAdded;
        else throw false;
    },
    /**
     * @returns {number} The number of roles removed from the user.
     */
    memberRemoveRoles: async function (member, roleIDs) {
        var rolesRemoved = 0;
        for (var i = 0; i < roleIDs.length; i++) try {
            if (member.guild.me.highestRole.position > member.guild.roles.get(roleIDs[i]).positon) {
                await member.removeRole(member.guild.roles.get(roleIDs[i]));
                rolesRemoved++;
            }
        } catch (err) {console.log(err);}
        if (rolesRemoved) return rolesRemoved;
        else throw false;
    },
    /**
     * @returns {string} The reason for the warning.
     */
    memberAddWarning: function (serverData, member, reason, decay = serverData.warningDecayDays) {
        let serverMember = serverData.members[member.id];
        if (!serverMember) if (member.id) {
            serverData.members[member.id] = new c.Member(member.id, [new c.Warning(reason, serverData, decay)]);
            return reason;
        } else throw false;
        serverMember.addWarning(serverData, member, reason, decay);
        require("../DR1.js").bot.emit("serverMemberObjectUpdate", member, serverData);
        return reason;
    },
    /**
     * @returns {void} Throws false if operation failed.
     */
    memberClearWarnings: async function (serverData, member, confirm = () => {return true;}) {
        let serverMember = serverData.members[member.id];
        if (serverMember && serverMember.warnings.length && await confirm()) {
            serverMember.clearWarnings();
            require("../DR1.js").bot.emit("serverMemberObjectUpdate", member, serverData);
        } else throw false;
    },
    /**
     * @returns {number} The offset rank the user has been set to.
     */
    memberSetRankOffset: function (serverData, member, rankOffset) {
        let serverMember = serverData.members[member.id];
        if (!serverMember) if (member.id && rankOffset) {
            serverData.members[member.id] = new c.Member(member.id, undefined, rankOffset);
            return rankOffset;
        } else throw false;
        serverMember.rankOffset = rankOffset;
        require("../DR1.js").bot.emit("serverMemberObjectUpdate", member, serverData);
        return rankOffset;
    },
    memberViewRankOffset: function (serverData, member) {
        let serverMember = serverData.members[member.id];
        if (!serverMember) throw false;
        return serverMember.rankOffset;
    },
    memberViewRank: function (serverData, member) {
        let rank = m.utility.getMemberRank(member, serverData);
        if (rank) return rank;
        else if (!serverData.members[member.id]) throw false;
        else return 0;
    }
};