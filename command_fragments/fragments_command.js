const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const r = require("../bot_modules/resolvables.js");
const cm = require("../command_subfragments/subfragments_command.js");

module.exports = {
    commandSetPerms: function (serverData, userData, channel, message, permissionData) {
        let temp = m.utility.inputGrab(userData);
        let command = temp.firstIndex;
        temp = m.utility.inputGrab(temp.remaining);
        let rank = r.getPerm(temp.firstIndex);
        if (rank > permissionData.executingAt) return new c.Res(
            "You can't specify a rank higher than your own (" + permissionData.executingAt + ").",
            userData
        );
        if ((!rank && rank !== 0) || rank < 0) return new c.Res(
            "Invalid rank specified.",
            userData
        );
        try {return new c.Res(
            "Set the permissions for command \"" + command + "\" to rank "
                + cm.commandEditPerms(serverData, command, rank) + ".",
            temp.remaining,
            true
        );} catch (err) {
            if (!err) return new c.Res(
                "Failed to set permissions for command \"" + command + "\".",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewCommandPerms: function (serverData, userData, channel) {
        try {
            let pages = m.page.pagify(cm.commandViewPerms(serverData), undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Current command permission ranks (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to find any command permission levels.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    createCommand: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData);
        try {
            let executable = m.utility.removeQuotes(temp.remaining, "```")
                .replace(/^(?:js)|(?:javascript)\s+/, "");
            cm.commandCreate(serverData, temp.firstIndex, executable);
            return new c.Res(
                "Successfully created command \"" + temp.firstIndex + "\".",
                "",
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to create command \"" + temp.firstIndex + "\".",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    deleteCommand: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData);
        try {
            cm.commandDelete(serverData, temp.firstIndex);
            return new c.Res(
                "Successfully deleted command \"" + temp.firstIndex + "\".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to delete command \"" + temp.firstIndex + "\".",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    clearCommands: async function (serverData, userData, channel, message, permissionData) {
        var output = "", success = false;
        try {
            await cm.commandClear(serverData, s.confirmByReactions(channel, serverData, permissionData.commandRank));
            output = "Commands cleared.";
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