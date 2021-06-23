const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {number} The level that the role's permissions have been set to. Throws false if the operation failed.
     */
    roleSetPermissionRank: function (serverData, roleIDs, level) {
        //let role = guild.roles.find((item) => {return item.name == roleName;});
        let rolesSet = 0;
        for (var i = 0; i < roleIDs.length; i++) {
            if (serverData.roles[roleIDs[i]]) {
                if (serverData.roles[roleIDs[i]]) {
                    serverData.roles[roleIDs[i]].permissionLevel = level;
                    rolesSet++;
                }
            } else {
                serverData.roles[roleIDs[i]] = new c.Role(roleIDs[i], undefined, level);
                rolesSet++;
            }
        }
        if (rolesSet) return rolesSet;
        else throw false;
    },
    roleViewPermissionRank: function (serverData, guild) {
        let roles = Object.values(serverData.roles), output = "";
        for (var i = 0; i < roles.length; i++) if (guild.roles.get(roles[i].id)) {
            if (roles[i].permissionLevel) {
                output += ((i == 0) ? "" : "\n") + guild.roles.get(roles[i].id).name + ": " + roles[i].permissionLevel;
            }
        } else delete serverData.roles[roles[i]];
        if (output) return output;
        else throw false;
    },
    /**
     * @returns {number} The level of role that may assign this role via the role command. Throws false if the operation failed.
     */
    roleSetAssignableRank: function (serverData, roleIDs, level) {
        //let role = guild.roles.find((item) => {return item.name == roleName;});
        let rolesSet = 0;
        for (var i = 0; i < roleIDs.length; i++) {
            if (serverData.roles[roleIDs[i]]) {
                if (serverData.roles[roleIDs[i]].assignableLevel != level) {
                    serverData.roles[roleIDs[i]].assignableLevel = level;
                    rolesSet++;
                }
            } else {
                serverData.roles[roleIDs[i]] = new c.Role(roleIDs[i], level);
                rolesSet++;
            }
        }
        if (rolesSet) return rolesSet;
        else throw false;
    },
    roleViewAssignableRank: function (serverData, guild) {
        let roles = Object.values(serverData.roles), output = "";
        for (var i = 0; i < roles.length; i++) if (guild.roles.get(roles[i].id)) {
            if (roles[i].assignableLevel != Infinity) {
                output += ((i == 0) ? "" : "\n") + guild.roles.get(roles[i].id).name + ": " + roles[i].assignableLevel;
            }
        } else delete serverData.roles[roles[i]];
        if (output) return output;
        else throw false;
    }
};