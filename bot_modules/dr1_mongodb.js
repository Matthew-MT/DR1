const m = require("./dr1_modules.js");
const c = require("./constructors.js");
const v = require("./constants/values.js");
var   MongoClient = require('mongodb').MongoClient;
const url = "mongodb://dr1:matthew13database@ds247699.mlab.com:47699/dr1data";
//var url = "mongodb+srv://MatthewM-T:\%40Matthew13@clouddata-khg7b.mongodb.net/test"
//dr1data

module.exports = {
    expectedGuilds: [],
    bot_data: {
        id: "bot_data",
        expectedGuilds: [],
        globalUserProperties: {},
        globalCommandstats: {},
        globalLogChannel: "",
        restartReplyChannel: ""
    },
    /*test: async function () {
        var db = await MongoClient.connect(url);
        var db1 = db.db("cloudData");
        var db2 = db.db("dr1data");
        console.log(await db1.collection("data"));
        console.log(await db2.collection("data"));
    },*/
    retrieveOne: async function (id) {
        var db = await MongoClient.connect(url, {useNewUrlParser: true});
        var dbo = db.db("dr1data");
        var temp = await dbo.collection("data").findOne({id: id});
        db.close();
        return temp;
    },
    saveOne: async function (data) {
        var db = await MongoClient.connect(url, {useNewUrlParser: true});
        var dbo = db.db("dr1data");
        if (await this.retrieveOne(data.id)) {
            var obj = {_id: (await this.retrieveOne(data.id))._id};
            //console.log("Database query id found: " + obj._id);
            await dbo.collection("data").updateOne(obj, {$set: data});
            //console.log("Updated one document.");
            db.close();
            return {updated: true, savedData: data};
        } else {
            await dbo.collection("data").insertOne(data);
            //console.log("Inserted one document.");
            db.close();
            return {inserted: true, savedData: data};
        }
    },
    deleteOne: async function (id) {
        var db = await MongoClient.connect(url, {useNewUrlParser: true});
        var dbo = db.db("dr1data");
        if (await this.retrieveOne(id)) dbo.collection("data").deleteOne({id: id});
        //console.log("Deleted one document.");
        db.close();
        return {deleted: true};
    },
    clearDB: async function () {
        var db = await MongoClient.connect(url, {useNewUrlParser: true});
        var dbo = db.db("dr1data");
        await dbo.dropDatabase();
        console.log("Cleared database.");
        //console.log(await dbo.collection("data").find({}));
        db.close();
        return {cleared: true};
    },
    getServData: async function (guild, servSpecific, prefix = v.prefix) {
        for (var i = 0; i < servSpecific.length; i++) if (servSpecific[i].id == guild.id) return true;
        //console.log("Failed to find one server in the RAM list.");
        var serverData = await this.retrieveOne(guild.id);
        if (serverData) {
            for (const automod of serverData.blacklist) c.verifyAutomodMethods(automod);
            for (const channel of Object.values(serverData.channels)) c.verifyChannelMethods(channel);
            for (const command of Object.values(serverData.customCommands)) c.verifyCommandMethods(command);
            for (const event of Object.values(serverData.events)) c.verifyEventMethods(event);
            for (const poll of Object.values(serverData.polls)) c.verifyPollMethods(poll);
            for (const member of Object.values(serverData.members)) c.verifyMemberMethods(member);
            for (const warnings of serverData.listeners) c.verifyWarningsMethods(warnings);
            if (!Object.keys(serverData.commandLevs).length) serverData.commandLevs = require("./dr1_modules.js").utility.getDefaults();
            let expected = new c.Server(guild.id, v.prefix);
            for (const property of Object.keys(expected)) if (!serverData.hasOwnProperty(property)) serverData[property] = expected[property];
            if (servSpecific[serverData.id]) return true;
            servSpecific[serverData.id] = serverData;
            //console.log("Retrieved data for server id \"" + guild.id + "\" (" + guild.name + ") from the database.");
            return {retrieved: true};
        } else {
            let temp = m.utility.initServ(guild, servSpecific, prefix);
            await this.saveOne(temp);
            //console.log("Initiated new server with id \"" + guild.id + "\" (" + guild.name + ").");
            return {initiated: true};
        }
    },
    checkAllServers: async function (bot) {
        let guilds = [...bot.guilds.values()],
        added = 0,
            removed = 0,
            promised = [];
            for (const id of this.bot_data.expectedGuilds) if (!guilds.find((guild) => {return id == guild.id;})) {
            promised.push(this.deleteOne(id));
            removed++;
        }
        for (const guild of guilds) if (!this.bot_data.expectedGuilds.includes(guild.id)) {
            this.bot_data.expectedGuilds.push(guild.id);
            added++;
        }
        promised.push(this.saveOne(this.bot_data));
        promised = await Promise.all(promised);
        console.log("Added " + added + " guilds to the list of expected guilds, and removed " + removed + " guilds from the database.");
        return {checked: true};
    },
    incrementCommandUsage: function (command) {
        if (this.bot_data.globalCommandstats[command]) this.bot_data.globalCommandstats[command]++;
        else this.bot_data.globalCommandstats[command] = 1;
    }
};

;(async function () {
    let temp = await module.exports.retrieveOne("bot_data");
    if (!temp) temp = (await module.exports.saveOne(module.exports.bot_data)).savedData;
    else for (const key of Object.keys(temp)) module.exports.bot_data[key] = temp[key];
})();