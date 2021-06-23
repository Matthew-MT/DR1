const f = require("../methods.js");

module.exports = {
    users_Lord_Chaos: '349384257560379392',
    bots_DR1: '375730613438644226',
    prefix: ">>",
    warningDecayDays: 7,
    letters: [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ],
    vowels: [
        "a", "e", "i", "o", "u", "y"
    ],
    numbers: [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ],
    pollChoices: {
        "0": ":zero:", "1": ":one:",
        "2": ":two:", "3": ":three:",
        "4": ":four:", "5": ":five:",
        "6": ":six:", "7": ":seven:",
        "8": ":eight:", "9": ":nine:",
        "A": "🇦", "B": "🇧",
        "C": "🇨", "D": "🇩",
        "E": "🇪", "F": "🇫",
        "G": "🇬", "H": "🇭",
        "I": "🇮", "J": "🇯",
        "K": "🇰", "L": "🇱",
        "M": "🇲", "N": "🇳",
        "O": "🇴", "P": "🇵",
        "Q": "🇶", "R": "🇷",
        "S": "🇸", "T": "🇹",
        "U": "🇺", "V": "🇻",
        "W": "🇼", "X": "🇽",
        "Y": "🇾", "Z": "🇿"
    },
    messageTypes: {
        /*leaveMessage: "leaveMessage",
        joinMessage: "joinMessage",
        defaultWarn: "defaultWarn",
        defaultKick: "defaultKick",
        defaultBanS: "defaultBanS",
        defaultBanH: "defaultBanH",*/
        rules: "rules",
        rule: "rules",
        leaves: "leaveMessage",
        leave: "leaveMessage",
        joins: "joinMessage",
        join: "joinMessage",
        warn: "defaultWarn",
        kick: "defaultKick",
        softban: "defaultBanS",
        ban: "defaultBanH"
    },
    specialChannelTypes: {
        announcements: "announcements",
        auditlog: "auditlog",
        events: "events",
        joins: "joins",
        all: "all"
    },
    illegalKeywords: [
        "all"
    ],
    cooldownData: {
        "visibility": {
            maxStacks: 1,
            expirationTime: {days: 1}
        },
        "prefix": {
            maxStacks: 4,
            expirationTime: {hours: 2}
        }
    },
    matchable: [
        ["e", "3"],
        ["l", "i", "1", "!", "[", "]", "|"],
        ["t", "7", "+"],
        ["a", "@"],
        ["o", "0"],
        ["b", "8"],
        ["s", "5", "$"],
        ["g", "6"],
        ["x", "%"],
        ["h", "#"]
    ]/*,
    dblIDs: [
        "326450539456102418",
        "321714991050784770",
        "205680187394752512"
    ]*/
};

f.deepFreeze(module.exports);