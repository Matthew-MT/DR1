const c = require("./constructors.js");
const t = require("./chronology.js");
const v = require("./constants/values.js");
const db = require("./dr1_mongodb.js");

module.exports = {
    updateGlobalCooldown: function () {},
    updateGlobalCollector: function (name, type = "command", expirationTime = {hours: 1}, stacks = 1) {
        if (type == "command") {
            let stats = db.bot_data.globalCommandstats[name];
            if (stats && stats.length) {
                let timeUntil = t.timeUntil(stats[0].expiration);
                if (timeUntil.done) {
                    if (timeUntil.timePassed.hours > 23) stats.length = 0;
                    stats.unshift(new c.Cooldown(name, t.addTimes(t.curTime(), expirationTime), stacks, Infinity));
                } else stats[0].stacks += stacks;
            } else db.bot_data.globalCommandstats[name] = [new c.Cooldown(name, t.addTimes(t.curTime(), expirationTime), stacks, Infinity)];
        }
    },
    updateServerCooldown: function (cooldowns, name, expirationTime = (v.cooldownData[name]) ? v.cooldownData[name].expirationTime : {hours: 1},
            stacks = 1) {
        let d = new Date(), cooldown = cooldowns[name], expiration = t.addTimes(t.curTime(), expirationTime);
        if (!cooldown && stacks > 0) cooldown = cooldowns[name] = new c.Cooldown(
            name,
            expiration,
            stacks,
            (v.cooldownData[name]) ? v.cooldownData[name].maxStacks : 1
        );
        else if (stacks > 0) cooldown.stacks += stacks;
        else if (!cooldown) throw false;
        if (t.timeUntil(cooldown.expiration).done) {
            if (stacks > 0) {
                cooldown.stacks = stacks;
                cooldown.expiration = expiration;
                return cooldown.stacks;
            } else {
                delete cooldowns[name];
                throw false;
            }
        }
        if (cooldown.stacks <= cooldown.maxStacks) return cooldown.stacks;
        else if (stacks >= 0) {
            if (v.cooldownData[name]) {
                let timeUntil = t.timeUntil(cooldown.expiration),
                    changesCanHappen = name + " changes may only be done " + v.cooldownData[name].maxStacks
                        + " time(s) every " + t.stringTimeUntil(v.cooldownData[name].expirationTime) + ".";
                if (!timeUntil.done) {
                    cooldown.message = "Limit reached! You may try again in **" + t.stringTimeUntil(timeUntil) + "**.\n" + changesCanHappen;
                } else cooldown.message = "Limit reached! You may try again in a few seconds.\n" + changesCanHappen;
            }
            throw cooldown;
        }
    },
    updateChannelCooldown: function () {},
    //updateUserCooldown: function () {},
    updateMemberCooldown: function () {}
};