const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const help = require("./help.js");
const compiler = require("../bot_modules/setup_functions.js").compiler;
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Support for DR1.",
    extra: "",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        try {
            await message.author.send("My support server can be found here: https://discord.gg/DmUHPTx");
            cd.updateGlobalCollector(commandName);
        } catch (err) {
            return "Failed to send a DM with the information. Please make sure you allow DR1 to send DMs to you before using this command."
        }
    }
};