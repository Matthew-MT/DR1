const m = require("./dr1_modules.js");
const c = require("./constructors.js");
const v = require("./constants/values.js");
const a = require("./automoderator.js");
const db = require("./dr1_mongodb.js");

module.exports = {
    getCommand: async function (input, message, serverData, noGuild = false) {
        //find a command corresponding to <input> from message <message>
        let commands = require("../DR1.js").commands, /*matched = input.match(/^\s*([a-zA-Z0-9]+)\s* /),*/
            level = serverData.permissions.intelligentMatching,
            temp = m.utility.inputGrab(input),
            found = m.utility.intelliMatch(temp.firstIndex, [
                ...Object.keys(commands),
                ...Object.keys(serverData.customCommands)
            ], Math.floor(level / 2))[0];
        //if (!matched) return;
        const /*command = matched[1],*/ userData = /*input.replace(matched[0], "")*/ temp.remaining;
        /*var i = 0;
        while (input[i] == " ") i++;
        var command = m.utility.smartSplit(input).shift();
        i += command.length;
        while (input[i] == " ") i++;
        input = input.slice(i);*/
        
        if (message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
            try {
                if (m.utility.checkRoles(message.member, found, serverData)) {
                    let cmd = commands[found] || serverData.customCommands[found];
                    if (!cmd || (noGuild && cmd.requiresGuild)) return;
                    let returned = await cmd.exe(serverData, message, userData);
                    if (returned) message.channel.send(returned, {"disableEveryone": true});
                } else message.channel.send("You do not have permission to run this command.");
            } catch (err) {
                if (!err) return;
                message.channel.send("An error occured.");
                console.log("Found: ", err);
            }
        }
    }, // End command finder and executor
    
    guildMessage: async function (message) {
        let serverData = require("../DR1.js").servSpecific[message.guild.id], commandPre;
        if (!serverData) {
            let roles = [...message.guild.roles.values()], topRole = roles[0];
            if (roles.length > 1) roles.forEach((item) => {if (item.position > topRole.position) topRole = item;});
            serverData = servSpecific[message.guild.id] = new c.Server(message.guild.id, commandPre = v.prefix, topRole);
        } else commandPre = serverData.prefix;
        if (!message.member) {
            message.member = await message.guild.fetchMember(message.author);
            return;
        }
        if (!serverData.members[message.member.id]) serverData.members[message.member.id] = new c.Member(message.member.id);
        if (!serverData.channels[message.channel.id]) serverData.channels[message.channel.id] = new c.Channel(message.channel.id);
        try {
            let found = await a.checkForBadness(message, serverData);
            if (found) {
                serverData.messageLog.push("\"" + message.content + "\" written by: **"
                    + message.author.tag + "** id: **" + message.author.id + "**");
                    bot.emit("automodSequenceMatch", found, message);
            } else if (m.utility.getMemberRank(message.member, serverData) >= serverData.channels[message.channel.id].botMuteLevel) {
                if (message.content.slice(0, commandPre.length) == commandPre && message.member.id != v.bots_DR1) {
                    await module.exports.getCommand(message.content.slice(commandPre.length), message, serverData);
                } else {
                    let mentioned = message.content.match(/^<@!?(\d{18})>/);
                    if (mentioned && mentioned[1] == v.bots_DR1) {
                        await module.exports.getCommand(message.content.slice(mentioned[0].length), message, serverData);
                    }
                }
            }
        } catch (error) {
            console.log("Failed to find one server in the RAM list.", error);
            if (error) {
                await db.getServData(message.guild, require("../DR1.js").servSpecific);
                /*if (getF_L(2, message.content) == commandPre) message.channel.send("Server data not found. I have just retrieved it,"
                + " so please try again.");*/
            } else throw new InternalError("Critical data retrieval error occurred.");
        }
    },
    
    privateMessage: async function (message) {
        let found = db.bot_data.globalUserProperties[message.author.id];
        if (!found) {
            await message.channel.send("Hello! Since I don't have your preferences for DMs yet,"
                + " would you mind answering a few questions? (You can answer yes or no, I'll understand)");
            message.channel.awaitMessages(async (msg) => {
                if (m.utility.intelliMatch(msg.content, ["no", "nope", "nah", "negative"], 2)) {
                    let temp = "";
                    if (message.content.slice(0, v.prefix.length) == v.prefix) temp = message.content.slice(v.prefix.length).trim();
                    else {
                        let match = message.content.match(/^\s*<@!?(\d{17,18})>/);
                        if (match && match[1] == v.bots_DR1) temp = message.content.replace(match[0], "").trim();
                        module.exports.getCommand(message.content, message, null, true);
                    }
                }
                if (m.utility.intelliMatch(msg.content, ["yes", "yeah", "yup", "ye"], 2)) {
                    message.channel.send("Alright. I'll need a default guild to execute commands in, if they require a guild.");
                    await f.wait(250);
                    m.utility.setupDefaultGuild(message.author, message.channel);
                    return true;
                }
            }, {max: 1});
        } else {
            let guild = bot.guilds.get(found.defaultGuild);
            if (!guild) ;
        }
    }
};