const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const t = require("../bot_modules/chronology.js");
const p = require("../bot_modules/page.js");
const cd = require("../bot_modules/cooldowns.js");
const lib = require("../bot_modules/library.js");
const msc = require("../command_subfragments/subfragments_!misc.js");

const vm = require("vm");

module.exports = {
    setServerPrefix: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData);
        try {
            cd.updateServerCooldown(serverData.cooldowns, "prefix");
            return new c.Res(
                "Set server prefix to " + msc.serverSetPrefix(serverData, temp.firstIndex),
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) {
                cd.updateServerCooldown(serverData.cooldowns, "prefix", undefined, -1);
                return new c.Res(
                    "Failed to set server prefix.",
                    userData
                );
            } else if (err.instance == "cooldown") return new c.Res(
                err.message,
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    setServerVisibility: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData), visibility = {"true": true, "false": false}[temp.firstIndex];
        try {
            cd.updateServerCooldown(serverData.cooldowns, "visibility");
            if (visibility === undefined) return new c.Res(
                "Invalid visibility parameter specified.",
                userData
            );
            else return new c.Res(
                "Visibility of this server set to " + msc.serverSetVisibility(serverData, visibility) + ".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) {
                cd.updateServerCooldown(serverData.cooldowns, "visibility", undefined, -1);
                return new c.Res(
                    "Failed to set visibility.",
                    userData
                );
            } else if (err.instance == "cooldown") return new c.Res(
                err.message,
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewGlobalServerStats: async function (serverData, userData, channel) {
        if (!serverData.permissions.visibility) return new c.Res(
            "Only servers who have set their visibility to true may view global server stats.",
            userData
        );
        let returned = msc.globalViewVisibleServers();
        if (!returned.length) return new c.Res(
            "No servers have opted to be visible.",
            userData
        );
        let pages = p.pagify(returned, 10);
        p.listenToPage((cur_page, pageNum) => {return {"embed": {
            "title": "Global visible server stats",
            "description": "Use the arrow emojis to change pages.",
            "color": 0x00bfff,
            "fields": cur_page,
            "footer": {"text": "Page " + (pageNum + 1) + "/" + (pages.length)}
        }};}, channel, pages);
        return new c.Res("", userData, true);
    },
    viewGlobalCommandStats: function (serverData, userData, channel) {
        let returned = msc.globalViewCommandStats();
        let pages = p.pagify(returned, 4, "Global command stats");
        p.listenToPage((cur_page, pageNum) => {return {"embed": {
            "title": "Global stats",
            "description": "Use the arrow emojis to change pages.",
            "color": 0x00bfff,
            "fields": cur_page,
            "footer": {"text": "Page " + (pageNum + 1) + "/" + (pages.length)}
        }};}, channel, pages);
        return new c.Res("", userData, true);
    },
    setLenience: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData), level = Number(temp.firstIndex);
        if (temp.firstIndex && level !== NaN && level >= 0 && serverData.permissions.intelligentMatching !== level) {
            return new c.Res(
                "Lenience level set to " + (serverData.permissions.intelligentMatching = level) + ".",
                temp.remaining,
                true
            );
        } else return new c.Res(
            "Invalid level specified. Please specify a number greater than or equal to zero.",
            userData
        );
    },
    evaluate: async function (serverData, userData) {
        try {
            let result = await lib.evaluate(userData);
            if (!result) throw new Error("Failed to produce a result.");
            return new c.Res(
                (result.result !== "" || (result.console !== "" && result.console !== undefined))
                    ? ((result.result !== "")
                        ? "Output:```md\n" + result.result + "```"
                        : "")
                    + ((result.console !== "" && result.console !== undefined)
                        ? "Console:```md\n" + result.console + "```"
                        : "")
                    : "Nothing was returned.",
                "",
                true
            );
        } catch (err) {
            return new c.Res(
                "An error ocurred:```md\n" + err.message + "```",
                "",
                true
            );
        }
    }
};