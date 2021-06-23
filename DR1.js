const latestUpdate =
      "#Patchnote 2.6.1\n\n"
    + "Improvements:\n"
    + "* Switched to an even safer way to evaluate JavaScript. Now it's safe against promise chaining as well,"
    + " which the other system was not.\n"
    + "* Fixed an error with uncached members.";



    

console.log("Initializing.");
console.log("Loading data...");

const commando = require('discord.js-commando');
const bot = new commando.Client({
    unknownCommandResponse: false
});

const servSpecific = {};

const m = require("./bot_modules/dr1_modules.js");
const c = require("./bot_modules/constructors.js");
const t = require("./bot_modules/chronology.js");
const v = require("./bot_modules/constants/values.js");
const f = require("./bot_modules/methods.js");
const p = require("./bot_modules/page.js");
const r = require("./bot_modules/resolvables.js");
const a = require("./bot_modules/automoderator.js");
const h = require("./bot_modules/handler_functions.js");
const db = require("./bot_modules/dr1_mongodb.js");
const lib = require("./bot_modules/library.js");
const dev = require("./bot_modules/developer_commands.js");

const fs = require("fs");
const commands = {};
const files = fs.readdirSync("./commands/");
files.forEach((file) => {
    if (file[0] != "_") commands[file.slice(0, file.length - 3)] = require("./commands/" + file);
});

console.log("Variables initialized.");

module.exports = {
    latestUpdate: latestUpdate,
    servSpecific: servSpecific,
    commands: commands,
    bot: bot,
    messageTypesToCheckFor: [],
    globalCriticalErrorCount: 0,
    globalCooldowns: {}
};

bot.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.guild) h.guildMessage(message);
    else h.privateMessage(message);
});

bot.on("guildCreate", async (guild) => {
    console.log("Joined a guild: " + guild.name);
    let serverData = m.utility.initServ(guild, servSpecific);
    await db.saveOne(serverData);
    let channel = m.utility.getFirstUsableChannel(guild.channels);
    servSpecific[guild.id] = new c.Server(guild.id, v.prefix);
    if (!channel) return;
    try {
        channel.send("Hello. I am DR1, a bot designed to help you keep your server fun and well-structured."
            + " To get started, type \"" + v.prefix + "help\" in any channel I can see and send messages in."
            + " You may also mention me instead of using my prefix.\n\n"
            + "If there is a feature you need, but that I don't have, you can join my support server and post the suggestion there"
            + " (invite to the support server can be found using the \"" + v.prefix + "support\" command, it will be DM'd to you).\n\n"
            + "Until roles are created with feature permissions for DR1, members with the \"administrator\" permission will be"
            + " the only members able to access my advanced commands (this includes the server owner).\n"
            + "Administrators automatically have full permissions at all times.");
        } catch (err) {console.log(err);}
    /*guild.createRole({
        name: "bot",
        data: {
            // general
            administrator: true,
            createInstantInvite: true,
            kickMembers: true,
            banMembers: true,
            manageRoles: true,
            managePermissions: true,
            manageChannels: true,
            manageChannel: true,
            manageServer: true,
            changeNickname: true,
            manageNicknames: true,
            // text
            readMessages: true,
            sendMessages: true,
            sendTTSMessages: true,
            manageMessages: true,
            embedLinks: true,
            attachFiles: true,
            readMessageHistory: true,
            mentionEveryone: true,
            // voice
            voiceConnect: true,
            voiceSpeak: true,
            voiceMuteMembers: true,
            voiceDeafenMembers: true,
            voiceMoveMembers: true,
            voiceUseVAD: true
        }
    });*/
    let numGuilds = bot.guilds.size;
    bot.user.setActivity(v.prefix + "help on " + numGuilds + " servers.");
    let logChannel = bot.channels.get(db.bot_data.globalLogChannel);
    if (logChannel) await logChannel.send({"embed": {
        "color": 0x006400,
        "title": "ℹ Bot status update",
        "description": "Joined a server. New server count: " + numGuilds
    }});
});

bot.on("guildDelete", async (guild) => {
    console.log("Left a guild: " + guild.name);
    delete servSpecific[guild.id];
    db.deleteOne(guild.id);
    let numGuilds = bot.guilds.size;
    bot.user.setActivity(v.prefix + "help on " + numGuilds + " servers.");
    let logChannel = bot.channels.get(db.bot_data.globalLogChannel);
    if (logChannel) await logChannel.send({"embed": {
        "color": 0x880808,
        "title": "ℹ Bot status update",
        "description": "Left a server. New server count: " + numGuilds
    }});
});

bot.on("guildMemberAdd", async (member) => {
    let serverData = servSpecific[member.guild.id];
    if (!serverData) serverData = servSpecific[member.guild.id] = new c.Server(member.guild.id);
    let announcementChannel = Object.values(serverData.channels).find((item) => {
        if (item.isSpecialOfType(v.specialChannelTypes.joins)) return item.id;
    });
    if (!announcementChannel) return;

    let message = new c.MessageFromMember(member);
    if (message.channel) message.channel.send(await serverData.joinMessage.exe(serverData, message, member.id));
});

bot.on("guildMemberRemove", async (member) => {
    if (member.id == v.bots_DR1) return;
    let serverData = servSpecific[member.guild.id];
    if (!serverData) serverData = new c.Server(member.guild.id);
    let announcementChannel = Object.values(serverData.channels).find((item) => {
        if (item.isSpecialOfType(v.specialChannelTypes.joins)) return item.id;
    });
    if (!announcementChannel) {
        if (serverData.members[member.id]) delete serverData.members[member.id];
        return;
    }

    let message = new c.MessageFromMember(member);
    if (message.channel) message.channel.send(await serverData.leaveMessage.exe(serverData, message, member.id));
    if (serverData.members[member.id]) delete serverData.members[member.id];
});

bot.on("dr1_tick", async () => {
    db.saveOne(db.bot_data);
    for (const serverData of Object.values(servSpecific)) {
        t.checkEvents(serverData, bot.guilds);
        db.saveOne(serverData);
    }
});

bot.on("dr1_tick_full", async () => {
    for (const serverData of Object.values(servSpecific)) {
        a.checkSoftbans(serverData, bot.guilds.get(serverData.id));
        a.checkWarnings(serverData);
    }
    for (stats of Object.values(db.bot_data.globalCommandstats)) for (var i = 0; i < stats.length; i++) {
        let timeUntil = t.timeUntil(stats[i].expiration);
        if (timeUntil.done && timeUntil.timePassed.hours > 23) stats.splice(i--, 1);
    }
});

bot.on("memberWarningsUpdate", async (member, warnings) => {
    let serverData = servSpecific[member.guild.id];
    var msg = [];
    serverData.listeners.forEach(async function (item) {
        if (item.instance == "warnings") {
            let temp = item.checkWarnings(warnings.length, {
                guild: member.guild,
                channel: member.user,
                member: member,
                author: member.user,
                content: warnings.join("\n"),
                delete: function () {}
            }, serverData);
            if (temp) msg.push(temp);
        }
    });
    if (msg.length) member.user.send(msg.join("\n"));
});

bot.on("automodSequenceMatch", async (word, message) => {
    /*let serverData = servSpecific[message.guild.id];
    var msg = [];
    for (automod of serverData.blacklist) {
        if (automod.instance == "automod") {
            let temp = automod.checkWord(word, message, serverData);
            if (temp) msg.push(temp);
        }
    }
    if (msg.length) message.author.send(msg.join("\n"));*/
    message.delete();
});

bot.on("serverMemberObjectUpdate", async (member, serverData) => {
    let serverMember = serverData.members[member.id];
    if (serverMember
    && serverMember.warnings.length == 0
    && serverMember.xp == 0
    && serverMember.rankOffset == 0) delete serverData.members[member.id];
});

function tick() {
    bot.emit("dr1_tick");
}

function fullTick() {
    bot.emit("dr1_tick_full");
}

bot.on("ready", async () => {
    console.log("Logged in.");
    //await db.clearDB();
    let promised = [], initiated = 0, retrieved = 0;
    promised.push(db.checkAllServers(bot));
    bot.user.setActivity(v.prefix + "help on " + bot.guilds.size + " servers.");
    for (const guild of bot.guilds.values()) promised.push(db.getServData(guild, servSpecific));
    for (const done of (await Promise.all(promised))) {
        if (done.initiated) initiated++;
        else if (done.retrieved) retrieved++;
    }
    console.log("Retrieved " + retrieved + " servers' data and intialized " + initiated + " servers."
    + "\nCurrently in " + bot.guilds.size + " servers."
    );
    var d = new Date();
    setTimeout(() => {
        setInterval(tick, 60 * 1000);
        setInterval(fullTick, 3600 * 1000);
    }, (60000 - d.getUTCMilliseconds()) - (d.getUTCSeconds() * 1000));
    if (db.bot_data.restartReplyChannel) {
        bot.channels.get(db.bot_data.restartReplyChannel).send("Restarted.");
        db.bot_data.restartReplyChannel = "";
    }
    let logChannel = bot.channels.get(db.bot_data.globalLogChannel);
    if (logChannel) await logChannel.send({"embed": {
        "color": 0x000088,
        "title": "ℹ Bot status update",
        "description": "Now online.\n"
            + "Server count: " + bot.guilds.size + "\n"
            + "Channels watched: " + bot.channels.size + "\n"
            + "Users currently served: " + bot.users.size
    }});
    console.log("Initialization completed.");
});

process.on("unhandledRejection", async (error) => {
    console.log(error, error.stack);
    module.exports.globalCriticalErrorCount++;
    let logChannel = bot.channels.get(db.bot_data.globalLogChannel);
    if (module.exports.globalCriticalErrorCount <= 4) {
        if (error.name == "MongoNetworkError" && logChannel) await logChannel.send({"embed": {
            "color": 0xff0000,
            "title": "⚠ Error",
            "description": "Database error detected."
        }});
    }
    if (module.exports.globalCriticalErrorCount > 4) {
        if (logChannel) await logChannel.send({"embed": {
            "color": 0xff0000,
            "title": "⌛ Bot is restarting...",
            "description": "A critical number of uncaught internal errors has been reached."
                + " Restarting to ensure proper operation."
        }});
        process.exit();
    }
});

bot.on("error", (error) => {
    console.log(error);
});

console.log("Methods initialized.");

bot.login('Token-not-found');




/**==============================================THINGS I SHOULD REMEMBER================================================
 * 
 * user: global property of a discord user
 * -author is a user property
 * 
 * member: contains info about roles and other information concerning the server the member is accessed on
 * 
 * https://www.dr1bot.xyz/ is free for use
 * 
 * http://jsben.ch/
 * 
 * ======================================================EXTRA INFO======================================================
 * 
 * ---------------------------------------------------ADD TO A SERVER----------------------------------------------------
 * 
 * https://discordapp.com/api/oauth2/authorize?scope=bot&client_id=375730613438644226
 * https://discordapp.com/oauth2/authorize?client_id=375730613438644226&scope=bot&permissions=2146958591
 * 
 * -----------------------------------------------ACTIVATION/DEACTIVATION------------------------------------------------
 * 
 * To activate bot: type "node ." in the terminal.
 * Deactivation: press ctrl + "c" to deactivate.
 * 
 * 
 * 
 * ------------------------------------------------------CHANGE LOG------------------------------------------------------
 * 
 * 0.0.0: First release. Responded to a message containing "ping" with "pong".
 * 0.1.0: Added command "!roll".
 * 0.1.1: Attempted making a second command. No success.
 * 0.1.2: It now responds to "hi" with "hello".
 * 0.1.3: Updated "!roll" command to now use the prefix ">".
 * 0.2.0: Decided to not use the built in command system and instead make my own.
 * 0.2.1: Fixed some bugs with the hand-built command system. Almost works now!
 * 0.3.0: A single working command "roll" is implemented in the new command system. Now uses ">>" as prefix and ":" as suffix.
 * 0.3.1: Added command ">>help:".
 * 0.4.0: Attempted some auto-mod features. Doesn't respond.
 * 0.4.1: Rebuilt auto-mod code, still doesn't work but looks cleaner and might, with some tweaking, work.
 * 0.4.2: Added some new QOL functions to help break strings up.
 * 0.5.0: Command system no longer needs the suffix. Working on a way to find the non-static content of the command.
 * 0.5.1: Added a "listbadmessagelog" command. Works... almost.
 * 0.5.2: "listbadmessagelog" works now. Unfortunately, auto-mod still doesn't work, meaning that it isn't filled.
 * 0.5.3: Added a rudimentary system for getting the command's contents. Will definitely be useful for my next command.
 * 0.5.4: Added "removenonletterchars" command. Does exactly what its name says it does.
 * 0.5.5: The way the command's contents are found has now been updated and is much more reliable.
 * 0.6.0: Yes! The automod now works. All I had to do is change message to message.content...
 * 0.6.1: Adding some command-restriction functions.
 * 0.7.0: Completely rebuilt several functions. Everything works really smoothly now, especially automod. New commands added as well.
 * 0.8.0: Connected to the database. Server settings are now saved if the bot goes offline.
 * 0.9.0: Added several new subcommands, and custom commands work now. Also working on a new command or two.
 * 1.0.0: Deployed main bot code to an unix server, as well as modularize all commands. Executable is much cleaner now.
 * 1.1.0: Added new event commands, and fixed several bugs. New subcommands also work now.
 * 1.2.0: Completely redesigned the custom command execution path. The language is now turing complete.
 * 1.3.0: Redesigned the help interface to be cleaner and more dynamic. Will automatically format now, no redesigns needed.
 * 1.4.0: Packaged chronological functions in their own section, and updated some commands.
 * 1.5.0: Created a set of consructors for certain data types, as well as add a new "listeners" field, which will allow more dynamic commands.
 * 2.0.0: Entirely refactored the command execution paths. Implemented several new sets of "helper" modules, to make code much more readable.
 * 2.1.0: Many bug fixes. Re-wrote command descriptions to document their subcommands more clearly. Updated object grabbers.
 * 2.2.0: Even more bug fixes, as well as refactoring of the dice parser. It's now the most powerful dice parser on discord.
 * 2.3.0: A lot of polishing. The bot's functions are now even cleaner looking, and almost all of the commands have been debugged.
 * 2.3.1: Fixed some UI graphical issues, fixed a bug where the bot would try to respond to it leaving a server.
 * 2.4.0: Added global stats, improved internal structure to be easier to navigate.
 * 2.4.1: Patched some persisting UI issues, as well as resolve some loopholes in the permission system.
 * 2.5.0: Added five new commands, as well as re-implement the kick and ban features. There is also softbanning enabled now.
**/