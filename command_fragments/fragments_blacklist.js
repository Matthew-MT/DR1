const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");
const bl = require("../command_subfragments/subfragments_blacklist.js");

module.exports = {
    automodAdd: async function (serverData, userData, channel, message, permissionData) {
        try {
            let temp = m.utility.smartSplit(userData);
            let command, rankIgnored, tempCmd, tempRank;
            for (var i = 0; i < temp.length && !(command && rankIgnored); i++) {
                tempCmd = temp[i].match(m.regex.command);
                if (tempCmd) {
                    command = serverData.customCommands[tempCmd[1]];
                    temp.splice(i--, 1);
                } else {
                    tempRank = temp[i].match(m.regex.rank);
                    if (tempRank) {
                        rankIgnored = r.getPerm(tempRank[1]);
                        temp.splice(i--, 1);
                    }
                }
                if (command && rankIgnored) break;
            }
            if (!rankIgnored) rankIgnored = permissionData.executingAt;
            if (rankIgnored > permissionData.executingAt) return new c.Res(
                "You can't blacklist words at a rank higher than your own (" + permissionData.executingAt + ").",
                userData
            );
            return new c.Res(
                "Added " + bl.blacklistAdd(serverData, m.utility.smartSplit(userData), command,
                    rankIgnored || permissionData.executingAt) + " sequences to the blacklist.",
                "",
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "No sequences added. They might be duplicates.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    automodRemove: async function (serverData, userData) {
        try {return new c.Res(
            "Removed " + bl.blacklistDelete(serverData, m.utility.smartSplit(userData))
                + " sequences from the blacklist.",
            "",
            true
        );} catch (err) {
            if (!err) return new c.Res(
                "No sequences removed. They might not have existed in the first place.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    automodView: async function (serverData, userData, channel) {
        try {
            let pages = m.page.pagify(bl.blacklistView(serverData), undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Currently blacklisted sequences (use the arrow emojis to change pages):\n```"
                    + cur_page + "```Page: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "No sequences are blacklisted.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    automodClear: async function (serverData, userData, channel, message, permissionData) {
        var output = "", success = false;
        try {
            await bl.blacklistClear(serverData, s.confirmByReactions(channel, serverData, permissionData.commandRank));
            output = "Blacklist cleared.";
            success = true;
        } catch (err) {
            if (!err) output = "Awesome.";
            else {
                console.log(err);
                throw err;
            }
        }
        if (!output) output = "An error occured.";
        return new c.Res(
            output,
            userData,
            success
        );
    }
};