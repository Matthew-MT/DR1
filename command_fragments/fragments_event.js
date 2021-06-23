const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const t = require("../bot_modules/chronology.js");
const v = require("../bot_modules/constants/values.js");
const ev = require("../command_subfragments/subfragments_event.js");

module.exports = {
    createEvent: function (serverData, userData) {
        var temp = m.utility.inputGrab(userData);
        let call = temp.firstIndex;
        if (serverData.events[call] != null
                && serverData.events[call] != undefined) {
            return new c.Res(
                "Event already exists.",
                userData
            );
        }
        var event = [], single = [], eventDate = [], eventTime = [], data, collector = "";
        var d = new Date();
        var times = new t.Time(0, 0, 0, d.getUTCDate(), d.getUTCMonth(), d.getUTCFullYear()), timesSet = [0, 0, 0, 0, 0, 0];
        for (var i = 0; event.length < 5 && i < 10 && data; i++) {
            temp = m.utility.inputGrab(temp.remaining);
            data = temp.firstIndex;
            single = data.match(m.regex.mono);
            if (single.length > 1) {
                single.shift();
                switch (single[1]) {
                case "y":
                    times.years = parseInt(single[0]) + (times.years || d.getUTCFullYear());
                    break;
                case "l":
                    times.months = parseInt(single[0]) + (times.months || d.getUTCMonth());
                    break;
                case "d":
                    times.days = parseInt(single[0]) + (times.days || d.getUTCDate());
                    break;
                case "h":
                    times.hours = parseInt(single[0]) + (times.hours || d.getUTCHours());
                    break;
                case "m":
                    times[1] = parseInt(single[0]) + (times[1] || d.getUTCMinutes());
                    break;
                case "s":
                    times.secs = parseInt(single[0]) + (times.secs || d.getUTCSeconds());
                    break;
                }
            }
            eventDate = data.match(m.regex.date);
            eventTime = data.match(m.regex.time);
            if (eventDate && eventDate.length > 2) {
                eventDate.shift();
                times.months = parseInt(eventDate.shift()) - 1;
                times.days = parseInt(eventDate.shift());
                if (eventDate.length > 0) {
                    times.years = (eventDate[0].length > 3) ? parseInt(eventDate.shift()) : parseInt("20" + eventDate.shift());
                }
            } else if (eventTime && eventTime.length > 2) {
                eventTime.shift();
                times.hours = parseInt(eventTime.shift());
                times.mins = parseInt(eventTime.shift());
                if (eventTime.length > 0) times.secs = parseInt(eventTime.shift());
            } else if (event.length < 4) event.push(data);
            else collector += data + " ";
            t.cleanDate(times);
        }
        temp.remaining = collector + temp.remaining;
        let eventData = {
            call: call,
            name: event[0],
            desc: event[1],
            command: serverData.customCommands[event.hours],
            repeat: parseInt(event.days)
        }
        try {
            ev.eventCreate(serverData, times, eventData);
            return new c.Res(
                "Created event with call \"" + call + "\".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to create new event.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    deleteEvent: function (serverData, userData) {
        let temp = m.utility.inputGrab(userData);
        try {
            ev.eventDelete(serverData, temp.firstIndex);
            return new c.Res(
                "Successfully deleted event \"" + temp.firstIndex + "\".",
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to delete event \"" + temp.firstIndex + "\".",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewEvents: function (serverData, userData, channel) {
        try {
            let pages = m.page.pagify(ev.eventView(serverData, channel.guild), undefined, undefined, undefined, false);
            if (!pages.length) throw false;
            m.page.listenToPage((cur_page, pageNum) => {
                return "Events list (use the arrow emojis to change pages):\n"
                    + cur_page + "\nPage: " + (pageNum + 1) + "/" + (pages.length);
            }, channel, pages);
            return new c.Res("", userData, true);
        } catch (err) {
            if (!err) return new c.Res(
                "No events found.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    },
    viewEvent: function (serverData, userData, channel) {
        let temp = m.utility.inputGrab(userData);
        try {
            if (!serverData.events[temp.firstIndex]) throw false;
            return new c.Res(
                ev.eventGetTimeUntil(serverData, temp.firstIndex, channel.guild),
                temp.remaining,
                true
            );
        } catch (err) {
            if (!err) {
                let time = t.curTime(), clock = {
                    0: "🕛", 1: "🕐", 2: "🕑", 3: "🕒",
                    4: "🕓", 5: "🕔", 6: "🕕", 7: "🕖",
                    8: "🕗", 9: "🕘", 10: "🕙", 11: "🕚"
                }[time.hours];
                time.days++, time.months++;
                return new c.Res(
                    clock + " Current UTC time: " + t.stringMinifiedTimeAt(time),
                    userData
                );
            } else {
                console.log(err);
                throw err;
            }
        }
    }
};