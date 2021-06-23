const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const v = require("../bot_modules/constants/values.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const cmd = require("../command_fragments/fragments_command.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const commandF = compiler.compile({
    "set": cmd.commandSetPerms,
    "create": cmd.createCommand,
    "delete": cmd.deleteCommand,
    "clear": cmd.clearCommands,
    "view": compiler.construct({
        "perms": cmd.viewCommandPerms,
        "permissions": cmd.viewCommandPerms,
        "default": cmd.viewCommandPerms
    })
});

module.exports = {
    desc: "Edit/create a command.",
    extra: "Subcommands:\n"
            + "#command .set [command] [level]:/n{Set the permission level of a given command to the designated level.}\n"
            + "#command .create [name] [executable]:/n{Creates a custom command.}\n"
            + "#command .delete [name]:/n{Deletes a custom command under the name given, if it exists.}\n"
            + "#command .clear:/n{Clears all custom commands.}\n"
            + "#command .view (.perms|.permissions):/n{View all command permissions.}\n\n"
            + "NOTE: As of v2.6, commands now use raw JavaScript as their language."
            + " This means you have a much larger degree of freedom while creating commands,"
            + " I have also provided a way to execute normal commands using custom commands.\n\n"
            + "Documentation:\n"
            + "{userInput: The user input to the command. You may parse this however you wish;}\n"
            + "{message: Contains some of the properties of the message that triggers the command;}\n"
            + "{message.content: The original content of the message;}\n"
            + "{message.delete: A function, call to delete the message;}\n"
            + "{message.author: Some properties of the author of the message;}\n"
            + "{message.author.id: The ID of the author;}\n"
            + "{message.author.username: The username of the author;}\n"
            + "{message.author.tag: The discord tag of the author;}\n"
            + "{message.author.nickname: The nickname of the author;}\n"
            + "{message.channel: Properties of the channel the message was sent in;}\n"
            + "{message.channel.id: ID of the channel;}\n"
            + "{message.channel.send: Accepts (string) Send a message to the channel;}\n"
            + "{execCommand: Accepts (command, args) Execute a DR1 command using the given args"
            + " (which is a single string, DR1 will handle the parsing on its own);}\n"
            + "{sendTo: Accepts (channelID, string) Send a message to the specified channel;}\n"
            + "If you have a suggestion for a property that should be added, please notify me, I will add it if it is safe to do so :)"
            /*+ "Documentation:\n"
            + "{Key: \"function name\"/aliases(input 1, input 2, etc...): description}\n{"
            + "variable/var(<name>): creates a variable with name <name>, returning that variable."
            + " NOTE: to call the variable afterwards, surround the <name> you specified with underscores (_).}\n{"
            + "random/rnd(<optional: max>): returns a random number from zero to nine (non-inclusive)"
            + " if no max is specified, or zero to max (non-inclusive) if a max is specified.}\n{"
            + "choose(<string>): splits a string at \"|\" and returns a random index.}\n{"
            + "mention/user(<ping/id>): mentions a user from the input.}\n{"
            + "tag(<ping/id>): returns a user's discord tag.}\n{"
            + "id(<ping/id>): returns a user's id."
            + " Note: these user functions will only return something if the user exists in the server.}\n{"
            + "run/exec/execute(<command>, <inputs>): runs a command <command> with input <inputs>.}\n{"
            + "store/save(<name>, <data>): store <data> under name <name>.}\n{"
            + "retrieve/get/find(<name>): returns the data stored under <name>.}\n{"
            + "remove(<name>): delete the data entry under <name>.}\n{"
            + "input(): returns the next user input packet, split at spaces (using quotes to discriminate, such as \"one string\").}\n{"
            + "parsenum/num/tonum(<input>): makes sure <input> is a number and returns that number if so.}\n{"
            + "print/out/output/write/say/send(<input>): add <input> to the message that will be sent.}\n{"
            + "delete(): deletes the message that triggered the command.}\n{"
            + "jump/goto(<num>): skips <num> lines forward or backward, beginning on the line after."
            + " Ex: jump(1) skips the next line, jump(-2) goes to the line right before the current line."
            + " You can use this to make loops. NOTE: loop execution is maxed at 100 iterations, to prevent indefinite loops.}\n{"
            + "if/test/decide(<boolean>, <num>): if <boolean> is not 0 or \"\", it will jump the specified number of lines."
            + " NOTE: you can use a boolean operator (==, >, & <, among others) within the <boolean> test.}\n{"
            + "void/skip(<input>): enables you to execute a function within <input> without returning anything.}\n{"
            + "You can perform any alphanumeric operation within parameter specifications,"
            + " such as 2 + 4 or \"foo\" + \"bar\", as well as boolean operations like \"==\".}"*/,
    default: 4,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }

        if (message.author.id != v.users_Lord_Chaos) return "Command is closed to non-developers for the time being."; 

        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await commandF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};