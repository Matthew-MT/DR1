const m = require("./dr1_modules.js");
const r = require("./resolvables.js");
const db = require("./dr1_mongodb.js");

module.exports = async (message) => {
    let found = message.content.match(/^drone\.([^\s`]+)([^]*)/), cmd, args, bot = require("../DR1.js").bot;
    if (found) {
        cmd = {
            "stats": function () {
                let guildStats = "";
                for (const guild of bot.guilds.values()) {
                    guildStats += "\n**" + guild.name + "**: " + guild.members.size + " members";
                }
                guildStats = guildStats.slice(1);
                let pages = p.pagify(guildStats, 1, "Guild statistics:", "", true);
                pages.unshift([{"name": "Core stats:", "value":
                    "Uptime: " + t.stringTimeUntil(t.cleanDate({secs: Math.floor(process.uptime())})) + "\n"
                    + "Guild count: " + bot.guilds.size + " guilds\n"
                    + "Channel count: " + bot.channels.size + " channels\n"
                    + "Member count: " + bot.users.size + " members"
                }]);
                p.listenToPage((cur_page, pageNum) => {return {"embed": {
                    "title": "DR1 developer statistics",
                    "color": 0xff6400,
                    "fields": cur_page,
                    "footer": {"text": "Page " + (pageNum + 1) + "/" + (pages.length)}
                }}}, message.channel, pages, undefined, undefined, undefined, true);
            },
            "restart": async function () {
                await message.channel.send("Exiting...");
                db.bot_data.restartReplyChannel = message.channel.id;
                await db.saveOne(db.bot_data);

                let logChannel = bot.channels.get(db.bot_data.globalLogChannel);
                if (logChannel) await logChannel.send({"embed": {
                    "color": 0x606060,
                    "title": "⌛ Bot is restarting...",
                    "description": "Restart requested. Please wait one minute."
                }});
                process.exit();
            },
            "setlogchannel": async function (args) {
                let channel = r.getChannel(args.trim(), bot);
                if (channel) {
                    db.bot_data.globalLogChannel = channel.id;
                    await db.saveOne(db.bot_data);
                    await channel.send("Global log channel set.");
                    return "Done.";
                } else return "Failed to set global log channel.";
            },
            "testjoin": function () {
                bot.emit("guildCreate", message.guild);
            },
            "testleave": function () {
                bot.emit("guildDelete", message.guild);
            },
            "leave": async function (args) {
                let guild = r.getGuild(args, bot);
                if (!guild) throw "No guild specified.";
                let name = guild.name;
                await guild.leave();
                return "Successfully left **" + name + "**.";
            },
            "whitelist": function (args) {}
        }[found[1]], args = found[2];
        try {
            if (!cmd) message.channel.send("Invalid developer command.");
            let res = await cmd(args);
            if (res) message.channel.send(res);
        } catch (err) {
            message.channel.send("An error occured:```\n"
                + err.stack.replace(/\(D:\\Documents\\Projects\\DR1\\[^)]*\)/g, "<DR1 executable>")
                .replace(/\(internal\/process\/[^)]*\)/g, "<internal>")
                + "```");
        }
    } else throw false;
}