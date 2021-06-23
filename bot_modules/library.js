const m = require("./dr1_modules.js");
const r = require("./resolvables.js");
const f = require("./methods.js");
var   commands;

const {VM} = require("vm2");

/*function runNewContext(code, properties) {
    var _console = "";
    const context = new VM({
        timeout: 200,
        sandbox: null
    });
    context.freeze({
        log: function (...strings) {
            for (string of strings) {
                let parsed = string;
                if (typeof string == "object" && string !== null) parsed = f.recursiveObjectParse(string);
                _console += parsed + " ";
            }
            _console += "\n";
        }
    }, "console");
    for (property of Object.keys(properties)) {
        context.freeze(properties[property], property);
    }
    return {
        result: toString(context.run(code)),
        console: _console
    };
}

/*const ivm = require("isolated-vm");
const isolate = new ivm.Isolate({memoryLimit: 8});

const bootstrap = isolate.compileScriptSync("new " + function () {
    let ivm = _ivm;
    delete _ivm;

    global.recursiveObjectStringify = function (object) {
        if (typeof object != "object" || object === null) throw new ReferenceError("Expected an object: " + (typeof object));
        const cache = [object], newObj = Object.assign({}, object);
        ;(function recurse(o, n) {
            for (key of Object.keys(o)) {
                if (typeof o[key] == "object" && o[key] !== null) {
                    let i;
                    if (cache.find((item, index) => {let r = item === o[key];if (r) {i = index;return r;};})) n[key] = "[Circular:" + i + "]";
                    else {
                        cache.push(o[key]);
                        recurse(o[key], n[key] = Object.assign({}, n[key]));
                    }
                } else if (typeof o[key] == "function") n[key] = "[Function: " + (o[key].name || key) + "]";
            }
        })(object, newObj);
        return JSON.stringify(newObj);
    }

    global.recursiveObjectParse = function (string) {
        if (typeof string != "string") throw new ReferenceError("Expected a string: " + (typeof string));
        const object = JSON.parse(string), cache = [object];
        ;(function recurse(o) {
            for (key of Object.keys(o)) {
                if (typeof o[key] == "object" && o[key] !== null) {
                    if (!cache.find((item) => {return item === o[key];})) recurse(o[key]);
                } else if (typeof o[key] == "string") {
                    let match = o[key].match(/^\[Circular:(\d+)\]$/);
                    if (match) {
                        let found = cache[match[1]];
                        if (found) o[key] = found;
                    }
                }
            }
        })(object);
        return object;
    }

    let log = _log;
    delete _log;
    /*global.log = function (...args) {
        log.applySync(undefined, args.map((arg) => {
            return new ivm.ExternalCopy(arg).copyInto();
        }));
    };*

    global.console = {
        log: function (...args) {
            log.applySync(undefined, args.map((arg) => {
                if (typeof arg == "object" && arg !== null) return new ivm.ExternalCopy(global.recursiveObjectStringify(arg)).copyInto();
                else if (typeof arg == "function") {
                    return new ivm.ExternalCopy((arg.name) ? "[Function: " + arg.name + "]" : "[Function]").copyInto();
                } else return new ivm.ExternalCopy(arg).copyInto();
            }));
        }
    };

    let properties = _properties.copySync();
    delete _properties;

    for (key of Object.keys(properties)) {
        if (!global.hasOwnProperty(key)) {
            if (properties[key].typeof == "function") {
                ;(() => {
                    let fnc = properties[key];
                    global[key] = function (...args) {
                        return fnc.applySync(undefined, args.map((arg) => {return new ivm.ExternalCopy(arg).copyInto();}));
                    }
                })();
            } else if (typeof properties[key] == "string") try {
                global[key] = global.recursiveObjectParse(properties[key]);
            } catch (err) {}
        }
    }
});*/

var customSyntaxError = function (type, data) {
    switch (type) {
    case "params":
        this.value = "Invalid number of parameters";
        this.data = data;
        break;
    case "args":
        this.value = "Invalid argument";
        this.data = data;
        break;
    case "user":
        this.value = "Invalid mention";
        this.data = data;
        break;
    case "vars":
        this.value = "Declared variable more that once";
        this.data = data;
        break;
    case "ops":
        this.value = "Failed operation";
        this.data = data;
        break;
    case "input":
        this.value = "Expected more inputs";
        this.data = "(" + data + ") failed inputs";
        break;
    case "function":
        this.value = "Unrecognised function";
        this.data = data;
        break;
    default:
        this.internal = true;
        this.error = data;
        break;
    }
}

module.exports = {
    evaluate: function (code, properties = {}) {
        var _console = "";
        const context = new VM({
            timeout: 200,
            sandbox: null
        });
        context.freeze({
            log: function (...strings) {
                for (string of strings) {
                    let parsed = string;
                    if (typeof string == "object" && string !== null) parsed = f.recursiveObjectParse(string);
                    _console += parsed + " ";
                }
                _console += "\n";
            }
        }, "console");
        for (property of Object.keys(properties)) context.freeze(properties[property], property);
        return {
            result: context.run(code) + "",
            console: _console
        };
    },/*async function (string, properties = {}) {
        let executable = this.removeQuotes(string, "```");
        if (executable.slice(0, 2) == "js") executable = executable.slice(2);
        if (executable.slice(0, 1) == "\n") executable = executable.slice(1);
        if (executable.includes("import")) throw new SyntaxError("Unexpected identifier: import");
        //console.log(executable);
        let context = isolate.createContextSync(),
        _global = context.global,
        __output__ = {
            console: ""        
        };
        _global.setSync("global", _global.derefInto());
        _global.setSync("_ivm", ivm);
        _global.setSync("_log", new ivm.Reference(function (...args) {
            __output__.console += args.join(" ") + "\n";
        }));
        let referencedProperties = {};
        for (key of Object.keys(properties)) {
            if (typeof properties[key] == "boolean"
            || typeof properties[key] == "number"
            || properties[key] === undefined
            || properties[key] === null) {
                referencedProperties[key] = properties[key];
            } else if (typeof properties[key] == "string") {
                referencedProperties[key] = JSON.stringify(properties[key]);
            } else if (typeof properties[key] == "function") {
                referencedProperties[key] = new ivm.Reference(properties[key]);
            } else if (typeof properties[key] == "object") try {
                referencedProperties[key] = f.recursiveObjectStringify(properties[key]);
            } catch (err) {console.log(err);}
        }
        _global.setSync("_properties", new ivm.Reference(referencedProperties));

        try {bootstrap.runSync(context);} catch (err) {
            console.log(err);
            return;
        }

        let res = isolate.compileScriptSync(executable).runSync(context, {timeout: 200});
        return {
            result: res,
            console: __output__.console
        };
    },*/
    properties: {},
    ops_arr: ["^", "*", "/", "-", "+", "%", "<", ">", "==", "<=", ">=", "&&", "||"],
    assign: ["=", "+=", "-=", "*=", "/=", "^=", "%="],
    removeQuotes: function (string, qouteLeft = "\"", quoteRight = qouteLeft) {
        if (string.slice(0, qouteLeft.length) == qouteLeft) string = string.slice(qouteLeft.length);
        if (string.slice(string.length - quoteRight.length) == quoteRight) string = string.slice(0, string.length - quoteRight.length);
        return string;
    },
    parseDice: function (string) {
        if (!string) return {
            result: Math.floor(Math.random() * 6) + 1,
            opsDone: false
        };
        if (string.match(/[^d0-9()+\-*/^% ]/)) return false;
        let dice = string.match(/\d*d\d*/g), output = string, noDice = !dice || !dice.length;
        if (noDice) {
            let die = parseInt(string);
            output = output.replace(die.toString(), Math.floor(Math.random() * die) + 1);
        } else dice.forEach((die) => {
            let mul = parseInt(die), tmp = die, num, nums = [];
            if (mul && mul > 0) {
                tmp = die.replace(mul.toString(), "");
                num = Number(tmp.slice(1)) || 6;
                while (mul-- > 0) nums.push(Math.floor(Math.random() * num) + 1);
                if (nums.length > 1) res = "(" + nums.join("+") + ")";
                else if (nums.length == 1) res = nums[0];
            } else {
                num = Number(die.slice(1));
                res = Math.floor(Math.random() * num) + 1;
            }
            output = output.replace(die, res);
        });
        let level = 0, terms = [""];
        for (var i = 0; i < output.length; i++) {
            if (output[i] == "(") {
                level++;
                terms.push("");
            } else if (output[i] == ")") terms[--level] += this.parse(terms.pop());
            else terms[level] += output[i];
        }
        terms[0] = this.parse(terms[0]);
        if (terms.length != 1) return false;
        return {
            result: terms[0],
            operations: output,
            opsDone: terms[0] != output
        }
    },
    performOp: function (a, op, b) {
        switch (op) {
        case "^":
            return Math.pow(parseFloat(a), parseFloat(b));
        case "*":
            return parseFloat(a) * parseFloat(b);
        case "/":
            return parseFloat(a) / parseFloat(b);
        case "-":
            return parseFloat(a) - parseFloat(b);
        case "+": {
            let numA = Number(a), numB = Number(b);
            if ((numA || numA === 0) && (numB || numB === 0)) return numA + numB;
            else return "\"" + this.removeQuotes(a.toString()) + this.removeQuotes(b.toString()) + "\"";
        }
        case "%":
            return parseFloat(a) % parseFloat(b);
        case "<":
            return (parseFloat(a) < parseFloat(b)) ? "1" : "0";
        case ">":
            return (parseFloat(a) > parseFloat(b)) ? "1" : "0";
        case "==":
            return (a == b) ? "1" : "0";
        case "<=":
            return (parseFloat(a) <= parseFloat(b)) ? "1" : "0";
        case ">=":
            return (parseFloat(a) >= parseFloat(b)) ? "1" : "0";
        case "&&":
            return (a.match(m.regex.zero)[0].length > 0 && b.match(m.regex.zero)[0].length > 0) ? "1" : "0";
        case "||":
            return (a.match(m.regex.zero)[0].length > 0 || b.match(m.regex.zero)[0].length > 0) ? "1" : "0";
        default:
            throw new customSyntaxError("ops", op);
        }
    },
    performAssign: function (variable, assignment, input) {
        assignment = assignment.toString();
        switch (assignment.trim()) {
        case "=":
            return input;
        case "+=":
            if (variable.match(m.regex.num).length > 0 && input.match(m.regex.num).length > 0) {
                return variable = parseFloat(variable) + parseFloat(input);
            } else return variable += input;
        case "-=":
            return parseFloat(variable) - parseFloat(input);
        case "*=":
            return parseFloat(variable) * parseFloat(input);
        case "/=":
            return parseFloat(variable) / parseFloat(input);
        case "^=":
            return Math.pow(parseFloat(variable), parseFloat(input));
        case "%=":
            return parseFloat(variable) % parseFloat(input);
        default:
            throw new customSyntaxError("ops", assignment);
        }
    },

    /**
     * Parses a flat set of alphanumeric operations, including logical operations and concatenation.
     * Failed parsing results in an error.
     * 
     * @param   {string} input Alphanumeric expression to parse.
     * @param   {object} vars  The variables object for the current parsing stack.
     * @returns {string}       The fully-parsed result of the operations.
     */
    parse: function (input, vars = {}) { //performs all alphanumeric operations within <input>, returning the final result if it is valid.
        var preSort = input.match(m.regex.ops);
        var temp;

        for (var i = 0; i < preSort.length; i++) {
            if (preSort[i] == "-"
            && preSort[i + 1] !== undefined
            && (this.ops_arr.includes(preSort[i - 1])
            || this.assign.includes(preSort[i - 1]))) preSort[i--] += (preSort.splice(i + 2, 1))[0];
        }

        for (var i = preSort.length; i >= 0; i -= 2) {
            if (this.assign.includes(preSort[i]) || i == 1) {
                for (var j = 0; j < this.ops_arr.length; j++) for (var l = i; l <= preSort.length; l += 2) if (preSort[l] == this.ops_arr[j]) {
                    if (vars.hasOwnProperty(preSort[l + 1])) preSort[l + 1] = vars[preSort[l + 1]];
                    if (vars.hasOwnProperty(preSort[l - 1]) && !this.assign.includes(preSort[l])) preSort[l - 1] = vars[preSort[l - 1]];
                    temp = this.performOp(preSort[l - 1], preSort[l], preSort[l + 1]);
                    preSort.splice(l - 1, 3, temp);
                    l -= 2;
                }
            }
            if (vars.hasOwnProperty(preSort[i - 1])) {
                if (this.assign.includes(preSort[i])) {
                    preSort[i - 1] = vars[preSort[i - 1]] = this.performAssign(vars[preSort[i - 1]], preSort[i], preSort[i + 1]);
                    preSort.splice(i, 2);
                    i -= 2;
                } else preSort[i - 1] = vars[preSort[i - 1]];
                if (i != preSort.length - 2) throw {internal: true, error: "ERROR: Failed to correctly parse a data set."};
            }
        }
        if (preSort.length != 1) throw {internal: true, error: "ERROR: Failed to fully parse a data set."};
        return preSort[0];
    },
    run: async function (functionToRun, message, serverData, queued = [], response = true, gettingDesc = false, nonCommand = false) {
        let {vars: vars, name: name, params: params} = functionToRun;
        //console.log("Running: " + name);
        switch (name) {
        case "var": case "variable":
            if (params.length > 1) throw new customSyntaxError("params", name);
            if (!vars["_" + params[0] + "_"]) {
                vars["_" + params[0] + "_"] = "undefined";
                functionToRun.return = "_" + params[0] + "_";
            } else throw new customSyntaxError("vars", params[0]);
            return functionToRun;
        case "random": case "rnd":
            if (params.length > 1) throw new customSyntaxError("params", name);
            if (params[0].match(m.regex.num).length > 0) functionToRun.return = Math.floor(Math.random() * parseInt(functionToRun.input));
            else if (params[0].length == 0) functionToRun.return = Math.floor(Math.random() * 10);
            else throw new customSyntaxError("args", functionToRun.input);
            return functionToRun;
        case "choose": {
            if (params.length > 1) throw new customSyntaxError("params", name);
            let temp = m.utility.smartSplit(this.removeQuotes(params[0]), "|");
            functionToRun.return = temp[Math.floor(Math.random() * temp.length)];
            return functionToRun;
        }
        case "mention": case "user": {
            if (params.length != 1) throw new customSyntaxError("params", name);
            let member = r.getMember(params[0], message.guild);
            if (member) functionToRun.return = member.toString();
            else throw new customSyntaxError("user", params[0]);
            return functionToRun;
        }
        case "sender":
            if (params.length != 0) throw new customSyntaxError("params", name);
            functionToRun.return = message.member.toString();
            return functionToRun;
        case "tag": case "id": {
            if (params.length != 1) throw new customSyntaxError("params", name);
            let member = r.getMember(params[0], message.guild);
            if (member.user[name]) functionToRun.return = member.user[name];
            else throw new customSyntaxError("user", params[0]);
            return functionToRun;
        }
        case "run": case "exec": case "execute":
            if (gettingDesc) return functionToRun;
            if (commands[params[0]] && !functionToRun.userDef) {
                commands = require("../DR1.js").commands;
                if (name == "run") commands[params[0]].exe(message, serverData, params[1], response);
                else await commands[params[0]].exe(message, serverData, params[1], response);
            } else if (commands[params[0]] && functionToRun.userDef) {
                functionToRun.userDef = false;
                queued.push(functionToRun);
            }
            return functionToRun;
        case "store": case "save":
            if (params.length != 2) throw new customSyntaxError("params", name);
            else serverData.customDataStore[params[0]] = params[1];
            return functionToRun;
        case "retrieve": case "get": case "find":
            if (params.length != 1) throw new customSyntaxError("params", name);
            else {
                if (!serverData.customDataStore[params[0]]) functionToRun.return = "empty";
                else functionToRun.return = serverData.customDataStore[params[0]];
            }
            return functionToRun;
        case "remove":
            if (params.length != 1) throw new customSyntaxError("params", name);
            else try {delete serverData.customDataStore[params[0]]} catch (err) {}
            return functionToRun;
        case "input": {
            if (gettingDesc) {
                functionToRun.inputs++;
                return functionToRun;
            }
            if (params.length != 0) throw new customSyntaxError("params", name);
            let temp = m.utility.inputGrab(functionToRun.userInput);
            if (!temp.firstIndex) throw new customSyntaxError("input", 1);
            functionToRun.userInput = temp.remaining;
            functionToRun.return =  "\"" + temp.firstIndex + "\"";
            return functionToRun;
        }
        case "parsenum": case "num": case "tonum":
            if (params.length != 1) throw new customSyntaxError("params", name);
            else functionToRun.return = parseFloat(params[0]);
            return functionToRun;
        case "print": case "out": case "output": case "write": case "say": case "send":
            if (gettingDesc) return functionToRun;
            if (params.length != 1) throw new customSyntaxError("params", name);
            else if (functionToRun.userDef) {
                functionToRun.userDef = false;
                queued.push(functionToRun);
            } else {
                if (params[0][0] == "\"") params[0] = params[0].slice(1);
                if (params[0][params[0].length - 1] == "\"") params[0] = params[0].slice(0, params[0].length - 1);
                functionToRun.output = params[0].replace(/\\n/, "\n");
            }
            return functionToRun;
        case "delete":
            if (params.length != 0) throw new customSyntaxError("params", name);
            else if (functionToRun.userDef) {
                functionToRun.userDef = false;
                queued.push(functionToRun);
            } else message.delete();
            return functionToRun;
        case "jump": case "goto":
            if (params.length != 1) throw new customSyntaxError("params", name);
            else functionToRun.jump = parseInt(params[0]);
            return functionToRun;
        case "if": case "test": case "decide":
            if (params.length != 2) throw new customSyntaxError("params", name);
            else if (params[0] != "0" && params[0] != "\"\"") functionToRun.jump = parseInt(params[1]);
            return functionToRun;
        case "desc": case "description":
            if (gettingDesc) {
                functionToRun.output = params.join(" ");
                if (functionToRun.output[0] == "\"") functionToRun.output = functionToRun.output.slice(1);
                if (functionToRun.output[functionToRun.output.length - 1] == "\"") {
                    functionToRun.output = functionToRun.output.slice(0, functionToRun.output.length - 1);
                }
                queued.push(functionToRun);
            }
            return functionToRun;
        case "void": case "skip":
            return functionToRun;
        default:
            throw new customSyntaxError("function", name);
        }
    }
}