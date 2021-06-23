const v = require("./constants/values.js");
var   commands, custom;
const dates = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

module.exports = {
    regex: {
        date: /^(\d\d?)(?:\/)(\d\d?)(?:\/)(\d{4}|\d{2})$/,
        time: /^(\d\d?)(?::)(\d\d?)(?::)(\d\d?)$/,
        mono: /^(\d+)([yldhms])$/,
        choice: /^([0-9A-Z])(?=[.,:;)])/,
        ops: /("[^"]*")|(_[^_]*_)|([+*/^=<>%]=?|-(?!\s*-)|&(?=&)&|\|(?=\|)\||-=)|(-?[^" +\-*/^=<>%&|]+)|-/g,
        zero: /^0+$/,
        num: /^\d+$/,
        command: /^<command:([^> ]+)>$/,
        rank: /^<rank:([^> ]+)>$/,
        newline: /\/n/g
    },
    utility: {
        testAgainst: function (str_in, arr_in = v.letters) {
            var output = "";
            if (str_in) for (var i = 0; i < str_in.length; i++) for (var j = 0; j < arr_in.length; j++) {
                if (str_in[i] == arr_in[j]) output += str_in[i];
            }
            return output;
        },
        
        smartSplit: function (input, splitter = ' ', discriminator = '"', includeDisc = false, cleanSplit = true) {
            //split <input> at spaces, while also keeping strings enclosed in quotes complete.
            var output = [], temp = "", string = false, escaped = 0;
            for (var i = 0; i < input.length; i++) {
                if (input[i] == splitter && !string && !escaped) {
                    if (!cleanSplit || (input[i - 1] != splitter && temp != "")) output.push(temp);
                    temp = "";
                } else if (input[i] == discriminator && !escaped) {
                    string = !string;
                    if (includeDisc) temp += discriminator;
                    if (!string && input[i + 1] == splitter) output.push(temp);
                } else if (input[i] == "\\" && !escaped) escaped = 2;
                else temp += input[i];
                if (escaped > 0) escaped--;
            }
            if (temp != "") output.push(temp);
            return output;
        },

        testFor: function (input, list) { //determine whether any substring of <input> contains an item stored within <list>
            var proc = "";
            for (var i = 0; i < input.length; i++) {
                for (var j = i; j < input.length; j++) {
                    proc += input[j];
                    if (list.find((item) => {return item == proc})) return true;
                }
                proc = "";
            }
            return false;
        },

        /**
         * 
         * @param {string} input 
         * @param {string} discriminator 
         * @param  {...string} splitters 
         * @returns {{firstIndex: string; remaining: string}}
         */
        inputGrab: function (input, discriminator = "\"", ...splitters) {
            if (!splitters.length) splitters = [" ", "\n"];
            var i = 0, output = "", string = false;
            while (splitters.includes(input[i])) i++;
            while ((!splitters.includes(input[i]) || string) && i < input.length) {
                if (discriminator && input[i] == discriminator) {
                    string = !string;
                    i++;
                } else output += input[i++];
            }
            while (splitters.includes(input[i])) i++;
            return {
                firstIndex: output,
                remaining: input.slice(i)
            }
        },

        getHighestRankedRole: function (member, serverData) {
            let roles = [...member.roles.values()], temp;
            roles.sort((a, b) => {return (a.position < b.position) ? 1 : -1;});
            for (var i = 0; i < roles.length && temp === undefined; i++) {
                temp = serverData.roles[roles[i].id];
                if (temp) return roles[i];
            }
            return undefined;
        },

        getMemberRank: function (member, serverData, offset = ((serverData.members[member.id]) ? serverData.members[member.id].rankOffset : 0)) {
            if (member.id == v.users_Lord_Chaos) return Infinity;
            if (member.guild.ownerID == member.id) return Infinity;
            if (member.permissions.has("ADMINISTRATOR")) return Infinity;
            if (!member) return 0;
            let userLevel, role = this.getHighestRankedRole(member, serverData);
            if (role) userLevel = serverData.roles[role.id].permissionLevel;
            return ((userLevel) ? userLevel : 0) + ((offset) ? offset : 0);
        },

        getCommandRank: function (command, serverData) {
            if (serverData.commandLevs[command]) return serverData.commandLevs[command];
            else if (require("../DR1.js").commands[command]) return serverData.commandLevs[command] = this.getDefaults()[command];
            else if (serverData.customCommands[command]) return serverData.customCommands[command].permissionLevel;
            else throw false;
        },

        checkRoles: function (member, command, serverData) {
            if (member.id == v.users_Lord_Chaos) return true;
            if (member.guild.ownerID == member.id) return true;
            if (this.getMemberRank(member, serverData) >= this.getCommandRank(command, serverData)) return true;
            else return false;
        },

        getDefaults: function () {
            commands = require("../DR1.js").commands;
            var defaults = {};
            var commandNames = Object.keys(commands);
            for (var i = 0; i < commandNames.length; i++) defaults[commandNames[i]] = commands[commandNames[i]].default;
            return defaults;
        },

        initServ: function (guild, servSpecific, prefix = v.prefix) {
            if (servSpecific[guild.id]) return servSpecific[guild.id];
            else {
                let c = require("./constructors.js");
                return servSpecific[guild.id] = new c.Server(guild.id, prefix);
            }
        },

        intelliMatch: function (string, matchAgainst, lenience = 4) {
            let errors = [], match = [...matchAgainst];
            if (typeof matchAgainst == "string") match = [matchAgainst];
            if (lenience == 0) return match.filter(t => t == string);
            if (lenience >= 1) {
                match = match.map(v => v.toLowerCase());
                string = string.toLowerCase();
            }
            for (var i = 0; i < match.length; i++) {
                if (match[i] == string) return [match[i]];
                for (var j = 0; j < match[i].length; j++) if (match[i][j] != string[j]) {
                    errors[i] ? errors[i].n += 10 : errors[i] = {n: 10, v: match[i]};
                    let temp = "";
                    v.matchable.find(arr => arr.includes(string[j]) ? temp = arr[0] : false);
                    if (lenience >= 3 && temp == match[i][j]) errors[i].n -= 4;
                    if (lenience >= 4 && v.vowels.includes(temp || string[j]) === v.vowels.includes(match[i][j])) errors[i].n -= 2;
                } else if (!errors[i]) errors[i] = {n: 0, v: match[i]};
            }

            errors = errors.filter(t => t.n <= lenience * 5).sort((a, b) => a.n - b.n);
            if (errors.length && errors[0].n === 0) errors.splice(1, errors.length);
            return errors.map((tmp) => {
                return matchAgainst.find((str) => {
                    if (lenience >= 1) return str.toLowerCase() == tmp.v;
                    else return str == tmp.v;
                });
            });
        },

        intelliMatch2: function (string, matchAgainst, lenience = 4) {
            let match, str = string;
            if (typeof matchAgainst == "string") match = [matchAgainst];
            else match = [...matchAgainst];
            if (lenience == 0) {
                let temp = match.find(t => t == string);
                return (temp) ? [temp] : [];
            }
            str = module.exports.utility.smartSplit(str.toLowerCase()).join(" ");
            match = match.map(s => module.exports.smartSplit(s.toLowerCase()).join(" "));
            let matches = [];
            
            for (const tmp of match) {
                if (tmp == str) return [matchAgainst.find(t => t.toLowerCase() == tmp)];
                if (!matches.find(t => t.val == tmp)) matches.push({val: tmp, tries: []});
                else continue;

                for (var i = 0; i < str.length; i++) {
                    let char = str[i], j = i, tries = matches.find(t => t.val == tmp).tries;
                    if (!tries.length) tries.push({val: "", errors: 0});
                    let prevTries = [...tries];

                    for (const _try of prevTries) {
                        _try.val += char;
                        if (char != tmp[_try.val.length]) {
                            _try.errors++;
                            tries.push({val: _try.val});
                        }
                    }
                }
            }
        },

        getFirstUsableChannel: function (channelCollection) {
            let channels = [...channelCollection.values()], channel;
            for (var i = 0; i < channels.length; i++) if (channels[i].permissionsFor(guild.me).has("SEND_MESSAGES")) {
                channel = channels[i];
                break;
            }
            return channel;
        },

        setupDefaultGuild: async function (user, channel) {
            let botUser = db.bot_data.globalUserProperties[user.id];
            if (!botUser) botUser = db.bot_data.globalUserProperties[user.id] = new c.User(user.id);
            await channel.send("Please reply with the guild ID, or you can also request a list of guilds to choose from.");
            channel.awaitMessages((msg) => {
                let found = bot.guilds.get(msg.content);
                if (found) {
                    botUser.defaultGuild = found.id;
                    return true;
                } else if (m.utility.intelliMatch(msg.content, [
                    "I want a list", "Give me a list",
                    "Can I see a list", "I'd like a list",
                    "I would like a list", "list", "a list",
                    "What are my options", "Can I see my options"
                ], 4)) {
                    let mutualGuilds = [], guilds = [...bot.guilds.values()], ranks = {};
                    guilds.forEach((guild) => {if (guild.members.get(user.id)) {
                        mutualGuilds.push(guild);
                        ranks[guild.id] = m.utility.getMemberRank(guild.members.get(user), servSpecific[guild.id]);
                    }});
                    mutualGuilds.sort((guild1, guild2) => ranks[guild2.id] - ranks[guild1.id]);
                    let formattedGuilds= mutualGuilds.map((guild) => {return {
                        "name": guild.name,
                        "value": "#⃣ **ID**: " + guild.id
                            + "\n👱 **Members**: " + guild.members.size
                    };}), pages = p.pagify(formattedGuilds, 16);
                    p.listenToPage((page, pageNum) => {return {"embed": {
                        "title": "Guild list",
                        "fields": page,
                        "footer": {"text": "Page: " + (pageNum + 1) + "/" + (pages.length)}
                    }}}, channel, pages, undefined, undefined, undefined, undefined, user);
                }
            }, {max: 1});
        },

        extractName: function (filePath) {
            let tempF = filePath.match(/(\\|\/)([^\\/]*)/g), tempFN = tempF[tempF.length - 1];
            return tempFN.slice(1, tempFN.length - 3);
        },

        removeQuotes: function (string, quoteLeft = "\"", quoteRight = quoteLeft) {
            let temp = string;
            if (temp.slice(0, quoteLeft.length) == quoteLeft) temp = temp.slice(quoteLeft.length);
            if (temp.slice(temp.length - quoteRight.length) == quoteRight) temp = temp.slice(0, temp.length - quoteRight.length);
            return temp;
        }
    }
};