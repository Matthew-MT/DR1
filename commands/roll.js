const m = require("../bot_modules/dr1_modules.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const lib = require("../bot_modules/library.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);


module.exports = {
    desc: "Returns a random number from 1-6 via message.",
    extra: "{Add a number to the command to roll any other type of die.}",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        //return "Nope";
        let output = lib.parseDice(userData);
        if (!output) return "Invalid dice expression!";
        cd.updateGlobalCollector(commandName);
        if (output.opsDone) return "🎲 You rolled: " + output.result + " (" + output.operations + ")";
        else return "🎲 You rolled: " + output.result;
    }
};