const m = require("../bot_modules/dr1_modules.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const commandName = m.utility.extractName(module.filename);

module.exports = {
    desc: "Hard backup of server data. This automatically saves all server settings to the database, ensuring data isn't lost"
            + " when the bot restarts. However, it is recommended to not spam this command, because this will put a heavy strain"
            + " on the executable, possibly reducing response times for other servers.",
    extra: "",
    default: 4,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        await db.saveOne(serverData);
        return "Saved server data to database.";
    }
};