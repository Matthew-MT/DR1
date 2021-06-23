const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const v = require("../bot_modules/constants/values.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");

module.exports = {
    desc: function(pre = v.prefix) {return "Creates a trigger that executes a custom command when triggered.";},
    extra: function(pre = v.prefix) {return "**Syntax**: " + pre + "trigger <command> <type> <input(s)>";},
    default: 4,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        var data = m.utility.smartSplit(userData);
        if (data[0] == "help") {
            help.exe(message, serverData, "");
            return;
        }
        return "This command is unfinished.";
        let permissionData = new c.PermissionData(
            serverData.commandLevs[module.filename.slice(0, module.filename.length - 3)],
            m.utility.getMemberRank(message.member, serverData)
        );
        async function send(output) {if (response && output) return await message.channel.send(output);}
        function audit(output) {
            if (message.guild.channels.find("id", serverData.channels.auditchannel)) {
                message.guild.channels.get(serverData.channels.auditchannel).send(output);
                return null;
            } else return output;
        }
        var temp = "";
        switch (data[1]) {
        case "word": case "words": case "warns": case "warnings":
            temp = data.shift();
            break;
        }
        switch (data[0]) {
        case "word": case "words":
            data.shift();
            if (data.length) {
                serverData.listeners.push(new c.Automod(data, temp));
                send("Successfully added automod trigger.");
                db.saveOne(serverData);
            } else send("You have to specify some words first!");
            break;
        case "warns": case "warnings":
            var num = parseInt(data[1]);
            if (num && serverData.customCommands[temp]) {
                serverData.listeners.push(new c.Warnings(num, temp));
                send("Successfully added warning trigger.");
                db.saveOne(serverData);
            } else send("You have to specify a valid custom command and number of warnings first!");
            break;
        }
    }
};