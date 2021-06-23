const v = require("./constants/values.js");

module.exports = {
    getPerm: function (string) {
        let lower = string.toLowerCase();
        if (lower == "true" || lower == "max" || lower == "maximum" || lower == "infinity") return Infinity;
        else if (lower == "false" || lower == "min" || lower == "minimum" || lower == "zero") return 0;
        else return Number(string);
    },
    getMember: function (string, guild) {
        let m = require("./dr1_modules.js"),
            id = m.utility.testAgainst(string, v.numbers),
            member = guild.members.get(id)
                || guild.members.find((item) => {return item.nickname == string;})
                || guild.members.find((item) => {return item.user.username == string;});
        return member;
    },
    getUser: function (string, collection) {
        let m = require("./dr1_modules.js"),
            id = m.utility.testAgainst(string, v.numbers),
            user = collection.get(id)
                || collection.find((item) => {return item.username == string;});
        return user;
    },
    getChannel: function (string, guild) {
        let m = require("./dr1_modules.js"),
            id = m.utility.testAgainst(string, v.numbers),
            channel = guild.channels.get(id)
                || guild.channels.find((item) => {return item.name == string;});
        return channel;
    },
    getRole: function (string, guild) {
        let role = guild.roles.get(string)
                || guild.roles.find((item) => {return item.name == string;});
        return role;
    },
    getCommand: function (string, guild) {
        let {commands, servSpecific} = require("../DR1.js"),
            command = commands[string]
                || servSpecific[guild.id].customCommands[string];
        return string;
    },
    getGuild: function (string, collection) {
        let guild = collection.find((item) => {return item.id == string})
            || collection.find((item) => {return item.name == string});
        return guild;
    }
};