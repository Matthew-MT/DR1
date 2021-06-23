module.exports = {
    checkForBadness: async function (message, serverData) {
        //checks the entire string <input> for corresponding sequences in the badWords[] array
        let temp = message.content.toLowerCase(), result;
        for (const automod of serverData.blacklist) {
            result = automod.checkWords(temp, message, serverData);
            if (result) return result;
        }
        return false;
    },
    checkSoftbans: async function (serverData, guild) {
        let cd = require("./cooldowns.js");
        for (const id of Object.keys(serverData.softbans)) try {
            cd.updateServerCooldown(serverData.softbans, id, undefined, 0)
        } catch (err) {
            if (!err) {
                if (guild.me.permissions.has("BAN_MEMBERS")) await guild.unban(id);
                delete serverData.softbans[id];
            }
        }
    },
    checkWarnings: function (serverData) {
        for (const serverMember of Object.values(serverData.members)) for (var i = 0; i < serverMember.warnings.length; i++) {
            try {serverMember.warnings[i].checkDecay();}
            catch (err) {if (!err) serverMember.warnings.splice(i--, 1);}
        }
    }
};