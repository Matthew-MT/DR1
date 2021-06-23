const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const s = require("../bot_modules/setup_functions.js").setup;
const v = require("../bot_modules/constants/values.js");
const pl = require("../command_subfragments/subfragments_poll.js");

module.exports = {
    createPoll: async function (serverData, userData, channel, message) {
        let temp = m.utility.inputGrab(userData, undefined, "\n");
        var choices = [], length = Object.keys(v.pollChoices).length, choice, collector = "";
        while (choices.length < length && temp.remaining) {
            choice = v.pollChoices[temp.firstIndex.match(m.regex.choice)[1]];
            if (choice && !choices.find((item) => {return item.choice == choice;})) choices.push({
                choice: choice,
                value: temp.firstIndex.slice(choice.length)
            });
            else collector += temp.firstIndex + " ";
            temp = m.utility.inputGrab(temp.remaining, undefined, "\n");
        }
        if (choices.length) try {
            pl.pollCreate(serverData, message.id, channel.id, choices);
            let output = "Vote using reactions for the choices below:";
            for (var i = 0; i < choices.length; i++) {
                for (var j = 0; j < choices[i].value.length; j++) if (choices[i].value.slice(j, 12) == "<on choose:>") {
                    let t = "", l = j;
                    j += 12;
                    while (choices[i].value[j] == " ") j++;
                    for (; choices[i].value[j] != " " && j < choices[i].value.length; j++) t += choices[i].value[j];
                    if (t && serverData.customCommands[t]) {
                        choices[i].call = t;
                        choices[i].value = choices[i].value.slice(0, l) + choices[i].value.slice(j);
                    } else return new c.Res(
                        "Failed to find specified custom command: " + t,
                        userData
                    );
                    break;
                }
                output += "\n" + choices[i].value;
            }
            let msg = await channel.send(output);
            for (var i = 0; i < choices.length; i++) await msg.react(choices[i].choice);
            return new c.Res(
                "",
                collector + temp.remaining,
                true
            );
        } catch (err) {
            if (!err) return new c.Res(
                "Failed to create poll.",
                userData
            );
            else {
                console.log(err);
                throw err;
            }
        }
    }
};