const m = require("./dr1_modules.js");
const v = require("./constants/values.js");
//var   commands = require("../DR1.js");
const lib = require("./library.js");

/**
 * Constructs a custom command executor from a string executable, using a Turing-complete pseudo language.
 * 
 * @param   {string}  commandData The command's executable.
 * @returns {function}            A function that can be used to execute the custom command.
 * @param   {object}  serverData  The server object from which the command call originates.
 * @param   {object}  message     A message object that is used to execute the command for.
 * @param   {string}  userInput   An optional input from a user.
 * @param   {boolean} response    Whether or not the commands executed within the custom command should send messages in the channel.
 * @param   {boolean} nonCommand  Whether the custom command is being executed as a user-triggered command or not.
 * @param   {boolean} gettingDesc Whether the command is being run in description mode or not.
 * @returns {Promise<string | {data: string; inputs: number;}>} Object only in description mode.
 */
module.exports = function (commandData) {
    return async function (serverData, message, userInput, response = true, nonCommand = false, gettingDesc = false) {
        var vars = {};
        //var data = commandData.match(codeSplit).slice(1);
        var data = commandData.split("\n");
        var level = 0, terms = [""], string = false, params = [], curFunction = [], queued = [], negative_jumps = 0, inputs = 0;
        try {for (var i = 0; i < data.length; i++) { //reads each line from top to bottom
            for (var j = 0; j <= data[i].length; j++) {
                if (data[i][j] == "\"" && data[i][j - 1] != "\\") {
                    string = !string;
                    terms[level] += data[i][j];
                } else if (data[i][j] == "(" && data[i][j - 1] != "\\" && !string) {
                    terms.push("");
                    curFunction.push("");
                    let temp = [];
                    temp.push(...v.letters, ...v.numbers);
                    for (var l = j - 1; l >= 0 && temp.includes(data[i][l]); l--) {
                        curFunction[level] = data[i][l] + curFunction[level];
                        //records which function, if any, should be run on completion of the parentheses
                    }
                    terms[level] = terms[level].slice(0, terms[level].length - curFunction[level].length);
                    level++;
                } else if ((data[i][j] == ")" && data[i][j - 1] != "\\" && !string) || j >= data[i].length) {
                    //triggers the parser to parse the data contained within the parentheses and then put it through the external function
                    //if there is one.
                    params = m.utility.smartSplit(terms[level], ",", undefined, true);
                    for (var l = 0; l < params.length; l++) {
                        try {params[l] = lib.parse(params[l], vars);}
                        catch (error) {
                            if (error.value || error.internal) {
                                error.line = i;
                                throw error;
                            } else throw {internal: true, error: error, line: i};
                        }
                    }
                    try {if (curFunction[level - 1]) {
                        var returned = await lib.run({
                            name: curFunction.pop(),
                            userDef: true,
                            params: params,
                            userInput: userInput,
                            vars: vars,
                            output: "",
                            return: "",
                            jump: 0,
                            inputs: inputs
                        }, message, serverData, queued, response, gettingDesc, nonCommand);
                        terms[level] = returned.return;
                        if (returned.jump < 0) {
                            if (negative_jumps < 100) {
                                negative_jumps++;
                                i += returned.jump;
                            } else throw {value: "Loop is too long", data: "jump function", line: i};
                        } else i += returned.jump;
                        if (returned.jump != 0) {
                            terms = [""];
                            level = 0;
                            break;
                        }
                        if (gettingDesc) inputs = returned.inputs;
                    } else {
                        curFunction.pop();
                        if (params.length > 1) throw {value: "Invalid comma placement", data: terms[level], line: i};
                        terms[level] = params[0];
                    }} catch (error) {
                        if (error.value || error.internal) {
                            error.line = i;
                            throw error;
                        } else throw {internal: true, error: error, line: i};
                    }
                    var temp = terms.pop();
                    if (level > 0) terms[--level] += temp;
                } else terms[level] += data[i][j];
            }
            if (level != 0) throw {value: "Missing parentheses", data: (level < 0) ? "(" : ")", line: i};
            else level = 0;
            if (string) throw {value: "Missing quote", data: "\"", line: i};
            terms = [""];
        }} catch (error) {
            if (error.internal) {
                console.log(error.error);
                return "An internal error occured while running your command, at line " + error.line + ".";
            } else if (error.value) return "Warning: an argument did not parse correctly: "
                + error.value + " at line " + error.line + ": " + error.data;
            else {
                console.log(error);
                return "A critical internal error occured.";
            }
        }
        var output = "";
        for (var i = 0; i < queued.length; i++) {
            await lib.run(queued[i], message, serverData, [], response, gettingDesc, nonCommand);
            output += queued[i].output;
        }
        if (!gettingDesc) return output;
        else return {desc: output, inputs: inputs};
    }
}