const m = require("../bot_modules/dr1_modules.js");
const v = require("./constants/values.js");

module.exports = {
    /**
     * 
     * @param {string|{"name": string; "value": string}[]} input 
     * @param {number} maxPerPage 
     * @param {string=} firstTitle 
     * @param {string=} format 
     */
    pagify: function (input, maxPerPage = 10, firstTitle, format = "", embed = true) {
        if (!input.length) return [];
        let page = 0;
        if (embed && typeof input == "string") {
            let pages = [[{"name": firstTitle, "value": ((format) ? "```" + format + "\n" : "")}]], extra = input.split("\n");
            for (var i = 0; i < extra.length; i++) if (pages[page][pages[page].length - 1].value.length + extra[i].length < 1024) {
                let len = pages[page][pages[page].length - 1].value.length;
                if (format && pages[page][pages[page].length - 1].value.slice(len - 1) == "}"
                && extra[i].slice(0, 1) == "{") {
                    pages[page][pages[page].length - 1].value = pages[page][pages[page].length - 1].value.slice(0, len - 1);
                    extra[i] = extra[i].slice(1);
                }
                pages[page][pages[page].length - 1].value += "\n" + extra[i];
            } else {
                if (pages.length) {
                    pages[page][pages[page].length - 1].value += ((format) ? "```" : "");
                    pages[page][pages[page].length - 1].value
                        = pages[page][pages[page].length - 1].value.replace(m.regex.newline, "\n");
                }
                if (pages[page].length >= maxPerPage) {
                    pages.push([]);
                    page++;
                }
                pages[page].push({"name": "(cont.)", "value": ((format) ? "```" + format + "\n" : "") + extra[i]});
            }
            pages[page][pages[page].length - 1].value += ((format) ? "```" : "");
            pages[page][pages[page].length - 1].value
                = pages[page][pages[page].length - 1].value.replace(m.regex.newline, "\n");
            return pages;
        } else if (embed && typeof input == "object" && input.length) {
            let pages = [];
            while (input.length > 0) pages.push(input.splice(0, maxPerPage));
            return pages;
        } else if (!embed && typeof input == "string") {
            let pages = [""], preParse = input.split("\n");
            for (const line of preParse) if (pages[pages.length - 1].length + line.length < 1800) {
                pages[pages.length - 1] += ((pages[pages.length - 1].length) ? "\n" : "") + line;
            } else pages.push("");
            if (!pages[pages.length - 1].length) pages.pop();
            return pages;
        } else return [];
    },
    /**
     * 
     * @param {Function} fnc 
     * @param {*} channel 
     * @param {string[] | {"name": string; "value": string}[][]} pages 
     * @param {0} page 
     * @param {10} skipButtonsAppearAfter 
     */
    listenToPage: async function (fnc, channel, pages, startingPage = 0, skipButtonsAppearAfter = 10, requiredPerms = 0, dev = false,
            specificUser = undefined) {
        if (!channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return;
        if (!channel.permissionsFor(channel.guild.me).has("EMBED_LINKS") && typeof pages[0] == "object") {
            channel.send("I do not have permission to send embeds in this channel. Please use a different channel.");
            return;
        }
        let message = await channel.send(await fnc(pages[startingPage], startingPage)),
            page = startingPage,
            serverData = require("../DR1.js").servSpecific[channel.guild.id];
        if (pages.length > 1) {
            let skipButtons;
            if (skipButtonsAppearAfter > 0) skipButtons = pages.length > skipButtonsAppearAfter;
            else skipButtons = false;
            if (skipButtons) await message.react("⏪");
            await message.react("⬅");
            await message.react("➡");
            if (skipButtons) await message.react("⏩");
            await message.awaitReactions(async (reaction, user) => {
                let member;
                if (channel.guild) member = channel.guild.members.get(user.id);
                if (!member && channel.guild) return false;
                if (member) {
                    if (member.id == v.bots_DR1) return false;
                    if (m.utility.getMemberRank(member, serverData) < requiredPerms
                    || dev && member.id != v.users_Lord_Chaos) return false;
                }
                if (reaction.emoji.name == "⬅") {
                    if (page > 0) page = page - 1;
                    else return false;
                } else if (reaction.emoji.name == "➡") {
                    if (page < pages.length - 1) page = page + 1;
                    else return false;
                } else if (skipButtons) if (reaction.emoji.name == "⏪") {
                    if (page > 0) page = (page > skipButtonsAppearAfter - 1) ? page - skipButtonsAppearAfter : 0;
                    else return false;
                } else if (reaction.emoji.name == "⏩") {
                    if (page < pages.length - 1) {
                        page = (page < pages.length - skipButtonsAppearAfter) ? page + skipButtonsAppearAfter : pages.length;
                    } else return false;
                }
                if (reaction.emoji.name == "⬅" || reaction.emoji.name == "➡"
                || (skipButtons && (reaction.emoji.name == "⏪" || reaction.emoji.name == "⏩"))) {
                    await message.edit(await fnc(pages[page], page, message));
                    await reaction.remove(user);
                    return true;
                }
                return false;
            }, {max: (pages.length) * 10, time: 300 * 1000});
        }
    },
    choose: async function (channel, choices, user) {
        let parsed = choices.map((s, i) => ({"name": (i % 8) + ":", "value": s})), pages = this.pagify(parsed, 8);
        this.listenToPage((page, curPage, message) => {}, channel, pages);
    }
};