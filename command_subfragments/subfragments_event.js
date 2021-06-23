const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;

module.exports = {
    /**
     * @returns {string} A string depicting the current UTC date.
     */
    getUTCtime: function () {
        let d = new Date();
        return d.getUTCMonth() + "/" + d.getUTCDate() + "/" + d.getUTCFullYear()
            + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    },
    /**
     * @returns {string} The event's call. Throws false if event creation was unsuccessful.
     */
    eventCreate: function (serverData, time, eventData) {
        if (serverData.events.hasOwnProperty(eventData.call)) throw false;
        let event = serverData.events[eventData.call] = new c.Event(time, eventData);
        if (!event || !event.call) throw false;
        else return event.call;
    },
    /**
     * @returns {void} Throws false if the operation was unsuccessful.
     */
    eventDelete: function (serverData, event) {
        if (serverData.events.hasOwnProperty(event)) delete serverData.events[event];
        else throw false;
    },
    /**
     * @returns {string} A list of current events for this server. Throws false if none.
     */
    eventView: function (serverData, guild) {
        let events = Object.keys(serverData.events), output = "";
        if (events.length) {
            events.forEach((event, i) => {
                let temp = serverData.events[event].checkTime(serverData, guild);
                if (temp) output += ((i == 0) ? "" : "\n") + temp;
            });
        }
        if (output) return output;
        else throw false;
    },
    /**
     * @returns {string} A string depicting the amount of time until the event starts.
     */
    eventGetTimeUntil: function (serverData, eventName, guild) {
        if (serverData.events[eventName]) return serverData.events[eventName].checkTime(serverData, guild);
        else throw false;
    }
};