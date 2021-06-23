const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const evt = require("../command_fragments/fragments_event.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const eventF = compiler.compile({
    "create": evt.createEvent,
    "delete": evt.deleteEvent,
    "view": compiler.construct({
        "all": evt.viewEvents,
        "default": evt.viewEvent
    })
});

module.exports = {
    desc: "Create, delete, and view events.",
    extra: "Subcommands:\n"
            + "#event .create [data]:/n{Create a new event. Time syntax: ends with y/l/d/h/m/s:}\n{"
            + "y: the years until the event (default is zero).}\n{"
            + "l: the months until the event.}\n{"
            + "d: the days until the event, in numbers.}\n{"
            + "h: the hours until the event, 24-hour clock (default is 00:00:00).}\n{"
            + "m: the minutes until the event, 0-59.}\n{"
            + "s: the seconds until the event, 0-59.}\n{"
            + "You can also use standard date/time notation, such as 09/17/21, or 04:43:18.}\n{"
            + "For date: mm/dd/yy or mm/dd/yyyy, if only two are specified then it will read as mm/dd. Default is current.}\n{"
            + "For time: hh/mm/ss, if only two are specified it will read as hh:mm.}\n{"
            + "The first input is how the event will be called."
            + " For example, if you enter \"quiz\", using \"time quiz\" will be the method for viewing the event."
            + " There are four more optional inputs, name, description, call, and repeat."
            + " Name is the name the event will have when someone uses the time command."
            + " Description is just some info about the event."
            + " Call is the custom command that will be executed when the event happens, if there is an announcements channel specified."
            + " Repeat is how many days to wait to repeat the event. If 0 or unspecified, the event will only happen once.}\n{"
            + "Name always comes first, then description, then call, then repeat (Hint: use \" \" to skip over values)."
            + " Remember to enclose the description in quotes if it has spaces!}\n"
            + "#event .delete [name]:/n{Deletes an event.}\n"
            + "#event .view (.all|[name]):/n{View all current events, or just one event.}",
    default: 1,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await eventF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};