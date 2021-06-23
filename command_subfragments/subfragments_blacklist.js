const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {number} Number of sequences added. Throws false if none.
     */
    blacklistAdd: function (serverData, array, command, permissionLevelIgnored = Infinity) {
        var command, numSequences = 0, found = false;
        array = array.filter((item) => {return typeof item == "string";});
        serverData.blacklist.find((item) => {
            if (typeof item.command == "object") {
                if ((item.command.name == command.name
                || item.command == command)
                && item.permissionLevelIgnored == permissionLevelIgnored) {
                    array.forEach((word) => {
                        if (!item.words.includes(words)) {
                            item.words.push(word);
                            numSequences++;
                        }
                    });
                    found = true;
                    return numSequences;
                }
            } else if (typeof item.command == "string" && item.command == "delete" && item.permissionLevelIgnored == permissionLevelIgnored) {
                array.forEach((word) => {if (!item.words.includes(word)) {
                    item.words.push(word);
                    numSequences++;
                }});
                found = true;
                return numSequences;
            }
        });
        if (!found) {
            serverData.blacklist.push(new c.Automod(array, command, permissionLevelIgnored));
            return array.length;
        } else if (numSequences && found) return numSequences;
        else throw false;
    },
    /**
     * @returns {number} Number of sequences removed. Throws false if none.
     */
    blacklistDelete: function (serverData, array) {
        var numSequences = 0;
        for (var i = 0; i < serverData.blacklist.length; i++) {
            for (var j = 0; j < serverData.blacklist[i].words.length; j++) if (array.includes(serverData.blacklist[i].words[j])) {
                serverData.blacklist[i].words.splice(j--, 1);
                if (!serverData.blacklist[i].words.length) {
                    s.dereference(serverData.blacklist[i].command);
                    serverData.blacklist.splice(i--, 1);
                }
                numSequences++;
            }
        }
        if (numSequences) return numSequences;
        else throw false;
    },
    /**
     * @returns {string} A list of the currently blacklisted sequences for the current server. Throws false if none.
     */
    blacklistView: function (serverData) {
        let output = "";
        serverData.blacklist.forEach((item, i) => {output += ((i == 0) ? "" : "\n") + item.words.join("\n");});
        if (serverData.blacklist.length) return output;
        else throw false;
    },
    /**
     * @returns {boolean} true if it cleared any sequences, otherwise throws false
     */
    blacklistClear: async function (serverData, confirm = () => {return true;}) {
        if (serverData.blacklist.length && await confirm()) {
            serverData.blacklist.forEach((item) => {s.dereference(item.command);});
            serverData.blacklist.length = 0;
            return true;
        } else throw false;
    }
};