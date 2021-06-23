const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;

module.exports = {
    desc: "Embeds some text for you.",
    extra: "#embed ([color]) [text]:/n{Embeds text. If a color is specified (using \"0xffffff\" format),"
        + " the embed sidebar will become that color. Otherwise, it will be grey.}",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        var data = m.utility.smartSplit(userData);
        if (data[0] == "help") {
            help.exe(message, serverData, commandName);
            return;
        }

        let temp = userData.match(/^(?:0x([\da-fA-F]{1,6}))(?=\s+)/), color = 0x888888, parsed = userData;
        if (temp) {
            color = parseInt(temp[1], 16);
            parsed = parsed.replace(temp[0], "");
        }
        parsed = parsed.trim();
        message.channel.send({"embed": {
            "color": color,
            "title": "Embedded text",
            "description": parsed
        }});
    }
};