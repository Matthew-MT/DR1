const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const db = require("../bot_modules/dr1_mongodb.js");

module.exports = {
    /**
     * @returns {string}
     */
    serverSetPrefix: function (serverData, prefix) {
        if (prefix && serverData.prefix != prefix) return serverData.prefix = prefix;
        else throw false;
    },
    /**
     * @returns {boolean}
     */
    serverSetVisibility: function (serverData, boolean) {
        if (serverData.permissions.visibility != boolean) return serverData.permissions.visibility = boolean;
        else throw false;
    },
    /**
     * @returns {{"name": string; "value": string}[]}
     */
    globalViewVisibleServers: function () {
        let {servSpecific: servSpecific, bot: bot} = require("../DR1.js"), output = [];
        for (const serverData of Object.values(servSpecific)) {
            let guild = bot.guilds.get(serverData.id), xp = 0;
            if (guild && serverData.permissions.visibility) {
                for (const serverMember of Object.values(serverData.members)) xp += serverMember.xp;
                output.push({
                    "name": guild.name,
                    "value": "👱 **Members**: " + guild.members.size
                        + ((xp) ? "\n🏁 **Collective experience**: " + xp : "")
                        + ((serverData.defaultInvite) ? "\n🔗 [Join](" + serverData.defaultInvite + ")" : "")
                        + ((serverData.description) ? "\n📜 **Description**:\n" + serverData.description : "")
                });
            }
        }
        return output;
    },
    /**
     * @returns {string}
     */
    globalViewCommandStats: function () {
        let output = "", stats = db.bot_data.globalCommandstats;
        for (const stat of Object.keys(stats)) {
            let times = 0;
            for (const data of stats[stat]) times += data.stacks;
            output += "📊 **" + stat + "**: " + times + " times\n";
        }
        return output;
    }
};