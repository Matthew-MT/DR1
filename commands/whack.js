const m = require("../bot_modules/dr1_modules.js");
const r = require("../bot_modules/resolvables.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);
var whacks = [
    "a stick",
    "an apricot",
    "1337",
    "bad puns",
    "error code 404",
    "a ton of feathers",
    "minecraft youtubers",
    "a slice of cheese",
    "several gallons of paint",
    "the wing of a Boeing 747",
    "a zombie's arm",
    "database debugging"
];

module.exports = {
    desc: "Whack <user> with random object.",
    extra: "",
    default: 0,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        let member = r.getMember(userData, message.guild);
        if (member) {
            message.delete();
            cd.updateGlobalCollector(commandName);
            return "🗞 Whacks **" + member.user.tag + "** with "
                + whacks[Math.floor(Math.random() * whacks.length)] + ".";
        } else return "Invalid user.";
    }
};