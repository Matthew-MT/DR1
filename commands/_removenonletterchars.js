const m = require("../bot_modules/dr1_modules.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");

module.exports = {
    desc: "Removes all non-letter characters from the input string, returning via message.",
    extra: "",
    default: 0,
    requiresGuild: false,
    exe: async function (serverData, message, userData, response = true) {
        var data = m.utility.smartSplit(userData);
        if (data[0] == "help") {
            help.exe(serverData, message, "removenonletterchars");
            return;
        }
        let tempF = module.filename.match(/(\\|\/)([^\\/]*)/g), tempFN = tempF[tempF.length - 1];
        tempFN = tempFN.slice(1, tempFN.length - 3);
        db.incrementCommandUsage(tempFN);
        try {if (response) return m.utility.testAgainst(userData, letters);} catch (err) {console.log(err);}
    }
};