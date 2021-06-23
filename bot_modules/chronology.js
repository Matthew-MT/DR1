const dates = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

module.exports = {
    getDaysOfMonth: function (month = 0, year = 0) {
        if (month >= 12 || month < 0) throw "Invalid month";
        if (month == 1) return (year % 4 != 0 || year % 400 == 0) ? 28 : 29;
        else return dates[month];
    },
    cleanDate: function (input) {
        if (!input.length && typeof input != "object") throw "Expected an array: " + (typeof input);
        input = this.addTimes(new this.Time(), input);
        while (input.secs >= 60) {
            input.secs -= 60;
            input.mins++;
        }
        while (input.secs < 0) {
            input.secs += 60;
            input.mins--;
        }
        while (input.mins >= 60) {
            input.mins -= 60;
            input.hours++;
        }
        while (input.mins < 0) {
            input.mins += 60;
            input.hours--;
        }
        while (input.hours >= 24) {
            input.hours -= 24;
            input.days++;
        }
        while (input.hours < 0) {
            input.hours += 24;
            input.days--;
        }
        while (input.months >= 12) {
            input.months -= 12;
            input.years++;
        }
        while (input.months < 0) {
            input.months += 12;
            input.years--;
        }
        //if (input.days < 1) throw "Invalid day";
        while (input.days > this.getDaysOfMonth(input.months, input.years)) {
            input.days -= this.getDaysOfMonth(input.months, input.years);
            input.months++;
            while (input.months >= 12) {
                input.years++;
                input.months -= 12;
            }
        }
        while (input.days < 0) {
            input.months--;
            while (input.months < 0) {
                input.years--;
                input.months += 12;
            }
            input.days += this.getDaysOfMonth(input.months, input.years);
        }
        return input;
    },
    timeUntil: function (event) {
        if (!event.length && typeof event != "object") throw "Expected an array: " + (typeof event);
        this.cleanDate(event);
        let curTime = this.curTime();
        curTime.secs++;
        let timeUntil = this.subTimes(Object.assign({}, event), curTime), timePassed = this.flipTimes(Object.assign({}, timeUntil));
        this.cleanDate(timeUntil);
        if (timeUntil.years < 0) {
            timeUntil.years = 0;
            timeUntil.done = true;
            this.cleanDate(timePassed);
            timeUntil.timePassed = timePassed;
        } else timeUntil.done = false;
        return timeUntil;
    },
    checkEvents: async function (serverData, guilds) {
        try {
            var events = Object.keys(serverData.events), guild = guilds.get(serverData.id);
            for (var i = 0; i < events.length; i++) try {
                await events[i].tryAnnounce(serverData, guild);
            } catch (err) {console.log(err);}
        } catch (err) {console.log(err);}
    },
    addTimes: function (event, time) {
        if (time.secs) event.secs += time.secs;
        if (time.mins) event.mins += time.mins;
        if (time.hours) event.hours += time.hours;
        if (time.days) event.days += time.days;
        if (time.months) event.months += time.months;
        if (time.years) event.years += time.years;
        return event;
    },
    subTimes: function (event, time) {
        if (time.secs) event.secs -= time.secs;
        if (time.mins) event.mins -= time.mins;
        if (time.hours) event.hours -= time.hours;
        if (time.days) event.days -= time.days;
        if (time.months) event.months -= time.months;
        if (time.years) event.years -= time.years;
        return event;
    },
    flipTimes: function (event) {
        if (event.secs) event.secs *= -1;
        if (event.mins) event.mins *= -1;
        if (event.hours) event.hours *= -1;
        if (event.days) event.days *= -1;
        if (event.months) event.months *= -1;
        if (event.years) event.years *= -1;
    },
    Time: function (s, m, h, d, l, y) {
        this.secs = s || 0;
        this.mins = m || 0;
        this.hours = h || 0;
        this.days = d || 0;
        this.months = l || 0;
        this.years = y || 0;
    },
    stringTimeUntil: function (timeUntil) {
        if (!timeUntil.done) {
            const time = [];
            if (timeUntil.years > 0) time.push(timeUntil.years.toString() + " year" + ((timeUntil.years > 1) ? "s" : ""));
            if (timeUntil.months > 0) time.push(timeUntil.months.toString() + " month" + ((timeUntil.months > 1) ? "s" : ""));
            if (timeUntil.days > 0) time.push(timeUntil.days.toString() + " day" + ((timeUntil.days > 1) ? "s" : ""));
            if (timeUntil.hours > 0) time.push(timeUntil.hours.toString() + " hour" + ((timeUntil.hours > 1) ? "s" : ""));
            if (timeUntil.mins > 0) time.push(timeUntil.mins.toString() + " minute" + ((timeUntil.mins > 1) ? "s" : ""));
            if (timeUntil.secs > 0) time.push(timeUntil.secs.toString() + " second" + ((timeUntil.secs > 1) ? "s" : ""));
            let temp = time.pop();
            let output = "";
            if (time.length > 0) output = time.join(", ");
            if (output) output += " and " + temp;
            else output = temp;
            return output;
        } else return "";
    },
    stringMinifiedTimeAt: function (time) {
        return time.months + "/" + time.days + "/" + time.years
            + " " + ((time.hours < 10) ? "0" : "") + time.hours
            + ":" + ((time.mins < 10) ? "0" : "") + time.mins
            + ":" + ((time.secs < 10) ? "0" : "") + time.secs;
    },
    curTime: function () {
        let d = new Date();
        return {
            secs: d.getUTCSeconds(),
            mins: d.getUTCMinutes(),
            hours: d.getUTCHours(),
            days: d.getUTCDate() - 1,
            months: d.getUTCMonth(),
            years: d.getUTCFullYear()
        };
    }
};