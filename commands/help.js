const m = require("../bot_modules/dr1_modules.js");
const v = require("../bot_modules/constants/values.js");
const p = require("../bot_modules/page.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const commandName = m.utility.extractName(module.filename);
const botInfo = require("../package.json");
const perPage = 10;

module.exports = {
    desc: "Gives you help with commands. Use \"help [command]\" to learn more about a specific command,"
            + " or \"help DR1\" to learn more about me.",
    extra: "",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        var commandPre = serverData.prefix;
        const {commands, latestUpdate} = require("../DR1.js");
        if (!message.channel.permissionsFor(message.channel.guild.me).has("EMBED_LINKS")) {
            message.channel.send("I do not have permission to send embeds in this channel. Please use a different channel.");
            return;
        }
        cd.updateGlobalCollector(commandName);
        if (userData.toLowerCase() == "dr1") {
            message.channel.send({"embed": {
                "title": "DR1:\n\n",
                "description": "**Version**: " + botInfo.version + "\n\n"
                    + "**Description**:\nDR1 is a general purpose discord bot coded solely by Lord_Chaos. DR1's language is javascript"
                    + " augmented with node. The command parser was also built by Lord_Chaos, after the built-in system was"
                    + " deemed too rigid. Several dozen hours (or more) have gone into the bot's development, albeit intermittently.",
                "color": 0xff6400,
                "fields": [{
                    "name": "Useful tips:",
                    "value": "To use an input string with spaces that shouldn't be split, enclose your input with quotes.\n"
                        + "Ex: \"this is one string\" will be read exactly as intended, instead of being split at spaces."
                        + " This is especially useful in assigning roles that contain spaces in their names.\n"
                        + "**NOTE**: several commands are unfinished and/or somewhat buggy."
                },{
                    "name": "Features:",
                    "value": "-Self assign/deassign roles\n"
                        + "-Customizable automod with character spam prevention capability\n"
                        + "-The ability to create custom commands\n"
                        + "-User commands for admins, such as assign/deassign roles, kick, and ban\n"
                        + "-Change which roles are self-assignable, and which roles are bot managers\n"
                        + "-Set which channels can have bot responses, and set an audit channel"
                },{
                    "name": "Latest update:",
                    "value": "```md\n" + latestUpdate + "```"
                }]
            }});
        } else if (commands[userData]) {
            let pages = p.pagify(commands[userData].extra, 2, commands[userData].desc, "css");
            if (!pages.length) return "No extra info has been provided for this command."
                + " If there is something you are still confused about,"
                + " please join my support server (use the \"support\" command to get the invite).";
            p.listenToPage((cur_page, pageNum) => {return {"embed": {
                "title": userData + ":",
                "description": "Key:```css\n#command [user input] val|alais1|alais2 .subcommand (optional value):\n{Description}```"
                    + "Use the arrow emojis to change pages.",
                "color": 0x006400,
                "fields": cur_page,
                "footer": {"text": "Page " + (pageNum + 1) + "/" + (pages.length)}
            }};}, message.channel, pages);
        } else {
            var commandNames = Object.keys(commands);
            var commandList = [];
            for (var i = 0; i < commandNames.length; i++) commandList.push({
                "name": commandNames[i],
                "value": commands[commandNames[i]].desc
            });
            var customCommandNames = Object.keys(serverData.customCommands);
            var customCommands = [];
            if (customCommandNames.length) for (var i = 0; i < customCommandNames.length; i++) {
                customCommands.push({
                    "name": customCommandNames[i],
                    "value": commandPre + customCommandNames[i]
                        + ((serverData.customCommands[customCommandNames[i]].desc)
                        ? ":\n" + serverData.customCommands[customCommandNames[i]].desc
                        : "")
                });
            }
            var page = 0;
            const regularCommands = p.pagify(commandList, perPage),
                customCommandPages = p.pagify(customCommands, perPage);
            if (!regularCommands.length && !customCommandPages.length) return;
            let pages;
            if (customCommandPages.length) pages = [...regularCommands, ...customCommandPages];
            else pages = regularCommands;
            p.listenToPage((cur_page, pageNum) => {return {"embed": {
                "title": (pageNum >= regularCommands.length) ? "Custom commands:" : "Commands:",
                "description": "Use the arrow emojis to change pages.",
                "color": 0x006400,
                "fields": cur_page,
                "footer": {"text": "Page " + (pageNum + 1) + "/" + (pages.length)}
            }};}, message.channel, pages);
        }
    }
};