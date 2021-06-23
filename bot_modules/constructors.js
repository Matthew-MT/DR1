const v = require("./constants/values.js");
const custom = require("./custom.js");

module.exports = {
    ERROR: true,
    /**
     * Construct a server settings object with defaults.
     * 
     * @param    {string}  id                  The server's id.
     * @param    {string}  prefix              The server's prefix. Default is the default prefix stored in /bot_modules/dr1_modules.js.
     * @constructs         serverData
     * @property {string}  instance:           "server"
     * @property {string}  id:                 guild.id
     * @property {array}   botmanagers:        ["botmanager"]
     * @property {Object}  commandLevs:        dr1_modules.utility.getDefaults()
     * @property {array}   blacklist:          []
     * @property {array}   messageLog:         []
     * @property {Object}  customCommands:     {}
     * @property {array}   commandMutes:       []
     * @property {Object}  customDatastore:    {}
     * @property {string | null} joinMessage:  null
     * @property {string | null} leaveMessage: null
     * @property {string}  prefix:             dr1_modules.data.prefix
     * @property {Object}  channels:           {"announcements": null; "auditlog": null; "joins": null}
     * @property {Object}  roles:              {}
     * @property {Object} members:             {}
     * @property {Object}  events:             {}
     * @property {Object}  polls:              {}
     * @property {array}   listeners:          []
     * @property {Object}  permissions:        {"xpEnabled": false; "furry": false; "levelUpEnabled": false}
     * @property {number}  warningDecayDays:   dr1_modules.data.warningDecayDays
     */
    Server: function (id, prefix, startingRoleID) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof id != "string") throw new TypeError("Expected a sting: " + (typeof id));
        if (typeof prefix != "string" && typeof prefix != "undefined") throw new TypeError("Expected a string: " + (typeof prefix));
        let m = require("./dr1_modules.js");
        Object.defineProperty(this, "instance", {
            value: "server",
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.prefix = (prefix) ? prefix : v.prefix;
        this.defaultInvite = "";
        this.commandLevs = m.utility.getDefaults();
        this.customCommands = {};
        this.customDatastore = {};
        this.blacklist = [];
        this.messageLog = [];
        this.channels = {};
        this.events = {};
        this.polls = {};
        this.members = {};
        this.roles = (startingRoleID) ? {[startingRoleID]: new module.exports.Role(startingRoleID, Infinity, Infinity)} : {};
        this.listeners = [];
        this.messages = {
            "leaveMessage": null,
            "joinMessage": null,
            "defaultWarn": null,
            "defaultKick": null,
            "defaultBanH": null,
            "defaultBanS": null,
            "rules": null
        };
        this.permissions = {
            "intelligentMatching": 0,
            "levelUpEnabled": 0,
            "spamPrevention": 0,
            /**owo*/"furry": 0,
            "visibility": 0,
            "xpEnabled": 0,
            "automod": 0
        };
        this.cooldowns = {};
        this.softbans = {};
        this.warningDecayDays = v.warningDecayDays;
    },

    Channel: function (id, botMuteLevel = 0) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        Object.defineProperty(this, "instance", {
            value: "channel",
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.specialProperties = [];
        this.botMuteLevel = botMuteLevel;
        module.exports.verifyChannelMethods(this);
    },
    verifyChannelMethods: function (channel) {
        if (channel.instance != "channel") return;
        if (!channel.addSpecialProperty) channel.addSpecialProperty = function (property) {
            if (!this.specialProperties.find((item) => {return item == property;})
                    && v.specialChannelTypes[property]) {
                this.specialProperties.push(property);
                return property;
            } else throw false;
        }
        if (!channel.removeSpecialProperty) channel.removeSpecialProperty = function (property) {
            if (this.specialProperties.find((item, i) => {if (item == property) {
                return this.specialProperties.splice(i, 1);
            };})) return property;
            else throw false;
        }
        if (!channel.isSpecialOfType) channel.isSpecialOfType = function (type) {
            if (this.specialProperties.find((item) => {return item == type;})) return this.id;
            else return undefined;
        }
    },

    /**
     * Constructs a new member object to be stored in a server settings object.
     * 
     * @param    {string} id          The member's id.
     * @param    {array}  warnings    An array of the member's warnings.
     * @param    {0}      rankOffset  The offset at which to initiate the member to.
     * @param    {0}      xp          The member's starting xp. Will not increase if server xp is turned off.
     * @constructs        serverMember
     * @property {string} instance:   "member"
     * @property {string} id:         member.id
     * @property {array}  warnings:   []
     * @property {number} xp:         0
     * @property {number} rankOffset: 0
     */
    Member: function (id, warnings = [], rankOffset = 0, xp = 0) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof id != "string") throw new TypeError("Expected a string: " + (typeof id));
        if (!(warnings.length >= 0) && typeof warnings != "object") throw new TypeError("Expected an array: " + (typeof warnings));
        if (typeof xp != "number") throw new TypeError("Expected a number: " + (typeof xp));
        Object.defineProperty(this, "instance", {
            value: "member",
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.warnings = warnings;
        this.xp = xp;
        this.rankOffset = rankOffset;

        module.exports.verifyMemberMethods(this);
    },
    verifyMemberMethods: function (member) {
        if (member.instance != "member") return;
        /**
         * Adds a warning to the member object.
         * Note: adding a warning without using this method will prevent the event emitter from triggering,
         * therefore it is not recommended.
         * 
         * @param {Object}                 serverData The server settings object that contains this member.
         * @param {Object}                 member     The member object provided by d.js.
         * @param {"No reason specified."} reason     The reason for the warning.
         * @param {number}                 decay      The amount of time the warning persists before decaying.
         */
        if (!member.addWarning) member.addWarning = function (serverData, member, reason = "No reason specified.", decay = v.warningDecayDays) {
            this.warnings.push(new module.exports.Warning(reason, serverData, decay));
            serverData.listeners.forEach((listener) => {
                if (listener.instance == "warnings") listener.checkWarnings(serverData, member);
            });
        }
        if (!member.clearWarnings) member.clearWarnings = function () {
            if (this.warnings.length) this.warnings.length = 0;
            else throw false;
        }
        if (!member.canAssignRole) member.canAssignRole = function (serverData, role) {
            let member = role.guild.members.get(this.id),
                memberLevel = require("./dr1_modules.js").utility.getMemberRank(member, serverData, this.rankOffset),
                roleData = serverData.roles[role.id];
            if (memberLevel == Infinity) return true;
            if (!roleData) return false;
            else return memberLevel >= serverData.roles[role.id].assignableLevel;
        }
        for (const warning of member.warnings) module.exports.verifyWarningMethods(warning);
    },

    User: function (id, defaultGuild) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof id != "string") throw new TypeError("Expected a string: " + (typeof id));
        if (typeof defaultGuild != "string") throw new TypeError("Expected a string: " + (typeof defaultGuild));
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.defaultGuild = defaultGuild;
        this.cooldowns = [];
    },

    /**
     * Constructs a new role object to be stored in server settings object.
     * 
     * @param    {number} assignableLevel The permissions level required to be able to assign this role with the "role" command.
     * @param    {number} permissionLevel The level of permissions this role has over the bot. 0 = minimum, Infinity = maximum.
     * @constructs        role
     * @property {string} instance:        "role"
     * @property {number} assignableLevel: 0
     * @property {number} permissionLevel: 0
     */
    Role: function (id, assignableLevel = Infinity, permissionLevel = 0) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof assignableLevel != "number") throw new TypeError("Expected a number: " + (typeof assignableLevel));
        if (typeof permissionLevel != "number") throw new TypeError("Expected a number: " + (typeof permissionLevel));
        Object.defineProperty(this, "instance", {
            value: "role",
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.assignableLevel = assignableLevel;
        this.permissionLevel = permissionLevel;
    },

    /**
     * Constructs a poll listener.
     * 
     * @param    {string} messageID  The message id in which the poll originates.
     * @param    {string} channelID  The channel in which the message resides.
     * @param    {array}  choices    The available poll choices.
     * @param    {array}  decay      The date at which the poll should be resolved.
     * @constructs        pollListener
     * @property {string} instance:  "poll"
     * @property {string} messageID: message.id
     * @property {string} channelID: channel.id
     * @property {array}  choices:   []
     * @property {array}  decayWhen: [second, minute, hour, day, month, year]
     * @method            checkEmojis
     */
    Poll: function (messageID, channelID, choices, decay) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof messageID != "string") throw new TypeError("Expected a string: " + (typeof messageID));
        if (typeof channelID != "string") throw new TypeError("Expected a string: " + (typeof channelID));
        if (!choices.length && typeof choices != "object") throw new TypeError("Expected an array: " + (typeof choices));
        Object.defineProperty(this, "instance", {
            value: "poll",
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.messageID = messageID;
        this.channelID = channelID;
        this.choices = choices;
        this.decayWhen = require("./dr1_modules.js").time.cleanDate(decay);

        module.exports.verifyPollMethods(this);
    },
    verifyPollMethods: function (poll) {
        if (poll.instance != "poll") return;
        /**
         * Checks the reactions on the poll message.
         * 
         * @param   {Object} guild The guild object provided by d.js.
         * @returns {array}        An array with the most-chosen choice. If multiple choices have been chosen the same number of times,
                                       it will return all matches.
         */
        if (!poll.checkEmojis) poll.checkEmojis = async function (guild) {
            let msg = guild.channels.get(this.channelID).fetchMessage(this.messageID);
            if (!msg) throw new ReferenceError("Poll not found");
            var choices = [];
            msg.reactions.forEach((item) => {
                if (this.choices.find((choice) => {return choice.choice == item.name;})) {
                    let count = item.count;
                    if (count && item.members.get(v.bots_DR1)) count--;
                    if (count) choices.push({
                        choice: item.emoji,
                        count: count
                    });
                }
            });
            if (choices.length) {
                var highest = [choices.shift()];
                if (highest[0]) {
                    choices.forEach((item) => {if (item.count > highest[0].count) highest[0] = item;});
                    for (var i = 0; i < choices.length; i++) if (choices[i].choice == highest[0].choice) {
                        choices.splice(i, 1);
                        break;
                    }
                    choices.forEach((item) => {if (item.count == highest[0].count) highest.push(item);});
                }
                return highest;
            }
        }
    },

    /**
     * Constructs an automod listener for a set of sequences.
     * 
     * @param    {array}  words        An array of words that will trigger the constructed listener.
     * @param    {string} command      The custom command to execute if the constructed listener is triggered.
     * @param    {number} rankIgnored  The permission level above which to ignore triggers.
     * @constructs        blacklistListener
     * @property {string} instance:    "automod"
     * @property {array}  words:       []
     * @property {string} command:     ""
     * @property {number} rankIgnored: Infinity
     * @method            checkWord
     */
    Automod: function (words, command, rankIgnored = Infinity) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (!words.length && typeof words != "object") throw new TypeError("Expected an array: " + (typeof words));
        if (command && typeof command != "object") throw new TypeError("Expected an object: " + (typeof command));
        if (command && command.instance != "command") throw new ReferenceError("Invalid command passed: " + command.instance);
        if (typeof rankIgnored != "number") throw new TypeError("Expected a number: " + (typeof rankIgnored));
        Object.defineProperty(this, "instance", {
            value: "automod",
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.words = words;
        this.rankIgnored = rankIgnored;
        if (command) {
            command.reference++;
            this.command = command;
        } else this.command = "delete";

        module.exports.verifyAutomodMethods(this);
    },
    verifyAutomodMethods: function (automod) {
        if (automod.instance != "automod") return;
        /**
         * Checks whether a word is part of the listener.
         * 
         * @param   {string} word       The word to check for.
         * @param   {Object} message    The message object provided by d.js.
         * @param   {Object} serverData The server settings object from which the listener originates from.
         * @returns {string}            The string returned by the executed custom command, if the detector has a custom command specified.
         */
        if (!automod.checkWords) automod.checkWords = async function (string, message, serverData) {
            if (typeof string != "string") throw new TypeError("Expected a string: " + (typeof string));
            if (typeof serverData != "object" && serverData.instance != "server") {
                throw new TypeError("Expected a server object: " + serverData.instance + " " + (typeof serverData));
            }
            if (require("./dr1_modules.js").utility.getMemberRank(message.member, serverData) >= this.rankIgnored) return "";
            for (const temp of this.words) if (string.includes(temp)) if (this.command.exe) {
                return await this.command.exe(serverData, message, temp);
            } else return temp;
            return "";
        }
        if (!automod.cleanUp) automod.cleanUp = function () {
            try {this.command.reference--;} catch (e) {}
            for (const p in this) delete this[p];
            return true;
        }
    },

    /**
     * Constructs a trigger for when a member reaches a certain number of warnings, then executes a custom command.
     * 
     * @param    {number} number    The number of warnings that will trigger the listener.
     * @param    {string} command   The command to execute when the listener is triggered.
     * @constructs        warningsListener
     * @property {string} instance: "warnings"
     * @property {number} number:   0
     * @property {Object} command:  undefined
     * @method            checkWarnings
     */
    Warnings: function (command, number = 0) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof number != "number") throw new TypeError("Expected a number: " + (typeof number));
        if (typeof command != "object") throw new TypeError("Expected an object: " + (typeof command));
        if (command.instance != "command") throw new ReferenceError("Invalid command passed: " + command.instance);
        Object.defineProperty(this, "instance", {
            value: "warnings",
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.number = number;
        command.reference++;
        this.command = command;

        module.exports.verifyWarningsMethods(this);
    },
    verifyWarningsMethods: function (warnings) {
        if (warnings.instance != "warnings") return;
        /**
         * Checks the warnings of a specified member, executing the specified custom command if the member has the same number of warnings
         * as the trigger. Note: this is to prevent multiple executions of the same warning trigger, as long as the trigger is checked
         * only on a warnings update.
         * 
         * @param {Object} serverData The server settings object from which the listener originates.
         * @param {Object} member     The member object provided by d.js.
         */
        if (!warnings.checkWarnings) warnings.checkWarnings = async function (serverData, member) {
            if (typeof member != "object") throw new TypeError("Expected a number: " (typeof member));
            if (typeof serverData != "object" && serverData.instance != "server") {
                throw new TypeError("Expected a server object: " + serverData.instance + " " + (typeof serverData));
            }
            let serverMember = serverData.members.find((u) => {return u.id == member.id});
            if (!serverMember) if (!member.user) {throw new ReferenceError("Invalid member object passed: undefined");
            } else return (serverData.members.push(new module.exports.Member(member.id))) ? "" : (process.exit());
            if (!serverData.customCommands[this.command]) throw new ReferenceError("Invalid custom command: " + this.command);
            if (serverMember.warnings.length == this.number) return this.command.exe(serverData, {
                author: member.user,
                member: member,
                guild: member.guild,
                channel: member.author,
                delete: () => {}
            }, serverMember.warnings.length, undefined, undefined, serverData.customCommands[this.command]);
            else return "";
        }
        if (!warnings.cleanUp) warnings.cleanUp = function () {
            this.command.reference--;
            for (const p in this) delete this[p];
            return true;
        }
    },

    /**
     * Constructs an event object, with methods for checking the event's data.
     * 
     * @param {number[]}  time              The time at which the event should start.
     * @param {Object}    command           A custom command to execute when it the event occurs.
     * @param {"command"} command.instance
     * @param {Object}    eventData         An object containing the data for the event.
     * @param {string}    eventData.name    The name of the event, to be displayed when the event is called on.
     * @param {string}    eventData.desc    The description of the event, to be displayed when the event is called on.
     * @param {number}    eventData.repeat  Whether to repeat the event a number of days later.
     * @param {string}    eventData.call    How to reference the event when event commands are executed.
     * @method            `tryAnnounce`     Checks whether the event can be announced.
     * @method            `checkTime`       Checks how much time is left until the event.
     */
    Event: function (time, eventData) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (!time.length && typeof time != "object") throw new TypeError("Expected an array: " + (typeof time));
        if (typeof eventData != "object") throw new TypeError("Expected an object: " + (typeof eventData));
        if (command && command.instance != "command") throw new ReferenceError("Invalid custom command passed: " + command.instance);
        let {call: call, name: name, desc: desc, command: command, repeat: repeat} = eventData;
        Object.defineProperty(this, "instance", {
            value: "event",
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.call = call;
        this.time = time;
        if (name) this.name = name;
        else this.name = call;
        if (desc) this.desc = desc;
        if (repeat) this.repeat = repeat;
        if (command) {
            command.reference++;
            this.command = command;
        }

        module.exports.verifyEventMethods(this);
    },
    verifyEventMethods: function (event) {
        if (event.instance != "event") return;
        /**
         * Checks whether the event is able to be announced yet, and announces if true.
         * If an event is complete, it will clear the event object, but external deletion is required to clean the containing object.
         * Otherwise, if it has a repeat, it will set the next date of repetition according to the last due date (creating a cycle)
         * 
         * @param   {Object} serverData The server object from which the event originates.
         * @param   {Object} guild      The guild object provided by d.js from which the event orginates.
         */
        if (!event.tryAnnounce) event.tryAnnounce = async function (serverData, guild) {
            const t = require("./chronology.js");
            let timeUntil = t.timeUntil(this.time);
            if (timeUntil.years < 0) {
                let channel = guild.channels.get(serverData.channels.find((item) => {
                    return item.isSpecialOfType("events");
                }));
                if (channel) channel.send("**" + this.name + "** has started!" + (
                    (this.command) ? "\n" + (await this.command.exe(serverData, {
                        channel: channel,
                        guild: guild,
                        delete: () => {}
                    }, this.call)) : ""
                ));
                if (this.repeat) {
                    this.time.days += this.repeat;
                    t.cleanDate(this.time);
                } else {
                    this.command.reference--;
                    for (const p in this) delete this[p];
                    throw false;
                }
                return;
            }
        }

        /**
         * Checks the time until an event, or attempts to announce the event if it has already started.
         * 
         * @param   {Object} serverData The server object from which the event originates.
         * @param   {Object} message    The message object provided by d.js which triggered this check.
         * @returns {string}            String detailing the amount of time left until an event starts
         */
        if (!event.checkTime) event.checkTime = async function (serverData, guild) {
            const t = require("./chronology.js");
            let timeUntil = t.timeUntil(this.time);
            if (!timeUntil.done) return "**" + this.name + "** is in **" + t.stringTimeUntil(timeUntil) + "**.";
            else this.tryAnnounce(serverData, guild);
        }
        if (!event.cleanUp) event.cleanUp = function () {
            this.command.reference--;
            for (const p in this) delete this[p];
            return true;
        }
    },

    Command: function (name, executable, permissionLevel = Infinity, reference = 0) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof name != "string") throw new TypeError("Expected a string: " + (typeof name));
        if (typeof executable != "string") throw new TypeError("Expected a string: " + (typeof executable));
        if (typeof reference != "number") throw new TypeError("Expected a number: " + (typeof reference));
        Object.defineProperty(this, "instance", {
            value: "command",
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.name = name;
        this.executable = executable;
        this.permissionLevel = permissionLevel;
        this.reference = reference;
        module.exports.verifyCommandMethods(this);
        /*this.exe(undefined, undefined, undefined, undefined, undefined, true).then((desc) => {
            if (desc.inputs) this.desc = desc.inputs + ((desc.desc) ? "\n" + desc.desc : "");
            else if (desc.desc) this.desc = desc.desc;
            else this.desc = "No description set.";
        });*/
    },
    verifyCommandMethods: function (command) {
        if (command.instance != "command") return;
        if (!command.exe) command.exe = async function (serverData, message, userData) {
            const lib = require("./library.js"),
            commands = require("../DR1.js").commands,
            promised = [],
            tracker = {
                messages: 0
            },
            properties = {
                userInput: userData,
                deleteMessage: async (id) => {
                    let msg = message.channel.fetchMessage(id) || message;
                    return await msg.delete();
                },
                message: {
                    content: message.content,
                    id: message.id,
                    author: {
                        username: message.author.username,
                        tag: message.author.tag,
                        id: message.author.id,
                        nickname: message.member.nickname
                    },
                    channel: {
                        id: message.channel.id,
                        send: function (string) {
                            if (typeof string != "string") throw new TypeError("\"send\" only accepts a string input!");
                            if (tracker.messages < 2) {
                                tracker.messages++;
                                promised.push(message.channel.send(string));
                            } else throw new RangeError("Cannot send more than 2 messages!");
                        }
                    }
                },
                execCommand: (command, input = "") => {
                    if (commands[command] && command != "eval") promised.push(commands[command].exe(serverData, message, input || ""));
                    else throw new ReferenceError("Invalid command specified.");
                },
                sendTo: function (id, string) {
                    if (tracker.messages < 2) {
                        let channel = require("./resolvables.js").getChannel(id, message.channel.guild);
                        if (!channel) throw new ReferenceError("Invalid channel specified!");
                        tracker.messages++;
                        promised.push(channel.send(string));
                    } else throw new RangeError("Cannot send more than 2 messages!");
                }
            };
            try {
                let result = lib.evaluate(this.executable, properties);
                //let results = (await Promise.all(promised)).reduce((item) => {return item || "";});
                //console.log(result/*, results*/);
                if (!tracker.messages) return (result.result ? result.result : "") || "No returned value.";
                else return "";
            } catch (err) {return "An error ocurred:```md\n" + err.message + "```";}
        }
    },

    Warning: function (reason, serverData, decay = serverData.warningDecayDays) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        if (typeof reason != "string") throw new TypeError("Expected a string: " (typeof reason));
        Object.defineProperty(this, "instance", {
            value: "warning",
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.reason = reason;
        if (decay) {
            let d = new Date();
            this.decayWhen = require("./chronology.js").cleanDate([d.getUTCSeconds(), d.getUTCMinutes(), d.getUTCHours(),
                d.getUTCDate() + decay,
                d.getUTCMonth(), d.getUTCFullYear()]);
            module.exports.verifyWarningMethods(this);
        }
    },
    verifyWarningMethods: function (warning) {
        if (warning.instance != "warning") return;
        if (warning.decay && !warning.checkDecay) warning.checkDecay = function () {
            let timeUntil = require("./chronology.js").timeUntil(this.decayWhen);
            if (timeUntil.done) throw false;
            else return timeUntil;
        }
    },

    Cooldown: function (id, expiration, stacks = 1, maxStacks = 1) {
        Object.defineProperty(this, "instance", {
            value: "cooldown",
            writable: false,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "id", {
            value: id,
            writable: false,
            enumerable: true,
            configurable: false
        });
        this.expiration = expiration;
        this.message = "Limit reached!";
        this.stacks = stacks;
        this.maxStacks = maxStacks;
    },

    /**
     * Creates a pseudo-message object from a member object supplied by d.js.
     * 
     * @param {Object} member  A guild#member object.
     * @param {Object} channel A guild#channel object. Optional, default is member#user (a DM direct to the user).
     * @constructs     message
     */
    MessageFromMember: function (member, channel = member.user) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        this.author = member.user;
        this.member = member;
        this.guild = member.guild;
        this.channel = channel;
        this.delete = function () {}
    },

    Res: function (output, remainingInput, success = false) {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        this.output = output;
        this.remainingInput = remainingInput;
        this.success = success;
    },

    /**
     * 
     * @param {number} commandRank The required rank for the current command path.
     * @param {number} executingAt The rank at which to attempt to run the current path.
     * @param {"You don't have permission to run this command!"} failMessage The message to display if the execution fails.
     */
    PermissionData: function (commandRank, executingAt, failMessage = "You don't have permission to run this command!") {
        if (this.ERROR) throw new SyntaxError("This constructor must be executed with the \"new\" keyword!");
        this.commandRank = commandRank;
        this.executingAt = executingAt;
        this.failMessage = failMessage;
    }
}