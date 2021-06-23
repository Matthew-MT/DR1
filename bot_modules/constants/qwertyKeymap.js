let ASCIIKeymap = {
    "a": {},
    "b": {},
    "c": {},
    "d": {},
    "e": {},
    "f": {},
    "g": {},
    "g": {},
    "h": {},
    "i": {},
    "j": {},
    "k": {},
    "l": {},
    "m": {},
    "n": {},
    "o": {},
    "p": {},
    "q": {},
    "r": {},
    "s": {},
    "t": {},
    "u": {},
    "v": {},
    "w": {},
    "x": {},
    "y": {},
    "z": {},
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "7": {},
    "8": {},
    "9": {},
    "0": {},
    " ": {},
    "`": {},
    "-": {},
    "=": {},
    "[": {},
    "]": {},
    "\\": {},
    ";": {},
    "'": {},
    ",": {},
    ".": {},
    "/": {}
};

{
    let {q, w, s, z} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["a"], {q, w, s, z});
}

{
    let {v, g, h, n} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["b"], {v, g, h, n});
    ASCIIKeymap["b"][" "] = ASCIIKeymap[" "];
}

{
    let {x, d, f, v} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["c"], {x, d, f, v});
    ASCIIKeymap["c"][" "] = ASCIIKeymap[" "];
}

{
    let {s, e, r, f, c, x} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["d"], {s, e, r, f, c, x});
}

{
    let {w, r, d, s} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["e"], {w, r, d, s});
    ASCIIKeymap["e"]["3"] = ASCIIKeymap["3"];
    ASCIIKeymap["e"]["4"] = ASCIIKeymap["4"];
}

{
    let {d, r, t, g, v, c} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["f"], {d, r, t, g, v, c});
}

{
    let {f, t, y, h, b, v} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["g"], {f, t, y, h, b, v});
}

{
    let {g, y, u, j, n, b} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["h"], {g, y, u, j, n, b});
}

{
    let {u, o, k, j} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["i"], {u, o, k, j});
    ASCIIKeymap["i"]["8"] = ASCIIKeymap["8"];
    ASCIIKeymap["i"]["9"] = ASCIIKeymap["9"];
}

{
    let {h, u, i, k, m, n} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["j"], {h, u, i, k, m, n});
}

{
    let {j, i, o, l, m} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["k"], {j, i, o, l, m});
    ASCIIKeymap["k"][","] = ASCIIKeymap[","];
}

{
    let {k, o, p} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["l"], {k, o, p});
    ASCIIKeymap["l"][";"] = ASCIIKeymap[";"];
    ASCIIKeymap["l"]["."] = ASCIIKeymap["."];
    ASCIIKeymap["l"][","] = ASCIIKeymap[","];
}

{
    let {n, j, k} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["m"], {n, j, k});
    ASCIIKeymap["m"][","] = ASCIIKeymap[","];
    ASCIIKeymap["m"][" "] = ASCIIKeymap[" "];
}

{
    let {b, h, j, m} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["n"], {b, h, j, m});
    ASCIIKeymap["n"][" "] = ASCIIKeymap[" "];
}

{
    let {i, p, l, k} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["o"], {i, p, l, k});
    ASCIIKeymap["o"]["9"] = ASCIIKeymap["9"];
    ASCIIKeymap["o"]["0"] = ASCIIKeymap["0"];
}

{
    let {o, l} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["p"], {o, l});
    ASCIIKeymap["p"]["0"] = ASCIIKeymap["0"];
    ASCIIKeymap["p"]["-"] = ASCIIKeymap["-"];
    ASCIIKeymap["p"]["["] = ASCIIKeymap["["];
    ASCIIKeymap["p"][";"] = ASCIIKeymap[";"];
}

{
    let {w, a} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["q"], {w, a});
    ASCIIKeymap["q"]["1"] = ASCIIKeymap["1"];
    ASCIIKeymap["q"]["2"] = ASCIIKeymap["2"];
}

{
    let {e, t, f, d} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["r"], {e, t, f, d});
    ASCIIKeymap["r"]["4"] = ASCIIKeymap["4"];
    ASCIIKeymap["r"]["5"] = ASCIIKeymap["5"];
}

{
    let {a, w, e, d, x, z} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["s"], {a, w, e, d, x, z});
}

{
    let {r, y, g, f} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["t"], {r, y, g, f});
    ASCIIKeymap["t"]["5"] = ASCIIKeymap["5"];
    ASCIIKeymap["t"]["6"] = ASCIIKeymap["6"];
}

{
    let {y, i, j, h} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["u"], {y, i, j, h});
    ASCIIKeymap["u"]["7"] = ASCIIKeymap["7"];
    ASCIIKeymap["u"]["8"] = ASCIIKeymap["8"];
}

{
    let {c, f, g, b} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["v"], {c, f, g, b});
    ASCIIKeymap["v"][" "] = ASCIIKeymap[" "];
}

{
    let {q, e, s, a} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["w"], {q, e, s, a});
    ASCIIKeymap["w"]["2"] = ASCIIKeymap["2"];
    ASCIIKeymap["w"]["3"] = ASCIIKeymap["3"];
}

{
    let {z, s, d, c} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["x"], {z, s, d, c});
    ASCIIKeymap["x"][" "] = ASCIIKeymap[" "];
}

{
    let {t, u, h, g} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["y"], {t, u, h, g});
    ASCIIKeymap["y"]["6"] = ASCIIKeymap["6"];
    ASCIIKeymap["y"]["7"] = ASCIIKeymap["7"];
}

{
    let {a, s, x} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["z"], {a, s, x});
    ASCIIKeymap["1"]["`"] = ASCIIKeymap["`"];
    ASCIIKeymap["1"]["2"] = ASCIIKeymap["2"];
    ASCIIKeymap["1"]["q"] = ASCIIKeymap["q"];
}

{
    let {w, q} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["2"], {w, q});
    ASCIIKeymap["2"]["1"] = ASCIIKeymap["1"];
    ASCIIKeymap["2"]["3"] = ASCIIKeymap["3"];
}

{
    let {e, w} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["3"], {e, w});
    ASCIIKeymap["3"]["2"] = ASCIIKeymap["2"];
    ASCIIKeymap["3"]["4"] = ASCIIKeymap["4"];
}

{
    let {r, e} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["4"], {r, e});
    ASCIIKeymap["4"]["3"] = ASCIIKeymap["3"];
    ASCIIKeymap["4"]["5"] = ASCIIKeymap["5"];
}

{
    let {t, r} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["5"], {t, r});
    ASCIIKeymap["5"]["4"] = ASCIIKeymap["4"];
    ASCIIKeymap["5"]["6"] = ASCIIKeymap["6"];
}

{
    let {y, t} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["6"], {y, t});
    ASCIIKeymap["6"]["5"] = ASCIIKeymap["5"];
    ASCIIKeymap["6"]["7"] = ASCIIKeymap["7"];
}

{
    let {u, y} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["7"], {u, y});
    ASCIIKeymap["7"]["6"] = ASCIIKeymap["6"];
    ASCIIKeymap["7"]["8"] = ASCIIKeymap["8"];
}

{
    let {i, u} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["8"], {i, u});
    ASCIIKeymap["8"]["7"] = ASCIIKeymap["7"];
    ASCIIKeymap["8"]["9"] = ASCIIKeymap["9"];
}

{
    let {o, i} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["9"], {o, i});
    ASCIIKeymap["9"]["8"] = ASCIIKeymap["8"];
    ASCIIKeymap["9"]["0"] = ASCIIKeymap["0"];
}

{
    let {p, o} = ASCIIKeymap;
    Object.assign(ASCIIKeymap["0"], {p, o});
    ASCIIKeymap["0"]["9"] = ASCIIKeymap["9"];
    ASCIIKeymap["0"]["-"] = ASCIIKeymap["-"];
}

{
    let {x, c, v, b, n, m} = ASCIIKeymap;
    Object.assign(ASCIIKeymap[" "], {x, c, v, b, n, m});
}

ASCIIKeymap["`"]["1"] = ASCIIKeymap["1"];

ASCIIKeymap["-"]["0"] = ASCIIKeymap["0"];
ASCIIKeymap["-"]["="] = ASCIIKeymap["="];
ASCIIKeymap["-"]["["] = ASCIIKeymap["["];
ASCIIKeymap["-"]["p"] = ASCIIKeymap["p"];

ASCIIKeymap["="]["-"] = ASCIIKeymap["-"];
ASCIIKeymap["="]["]"] = ASCIIKeymap["]"];
ASCIIKeymap["="]["["] = ASCIIKeymap["["];

ASCIIKeymap["["]["p"] = ASCIIKeymap["p"];
ASCIIKeymap["["]["-"] = ASCIIKeymap["-"];
ASCIIKeymap["["]["="] = ASCIIKeymap["="];
ASCIIKeymap["["]["]"] = ASCIIKeymap["]"];
ASCIIKeymap["["]["'"] = ASCIIKeymap["'"];
ASCIIKeymap["["][";"] = ASCIIKeymap[";"];

ASCIIKeymap["]"]["["] = ASCIIKeymap["["];
ASCIIKeymap["]"]["="] = ASCIIKeymap["="];
ASCIIKeymap["]"]["\\"] = ASCIIKeymap["\\"];
ASCIIKeymap["]"]["'"] = ASCIIKeymap["'"];

ASCIIKeymap["\\"]["]"] = ASCIIKeymap["]"];

{
    let {l, p} = ASCIIKeymap;
    Object.assign(ASCIIKeymap[";"], {l, p});
    ASCIIKeymap[";"]["["] = ASCIIKeymap["["];
    ASCIIKeymap[";"]["'"] = ASCIIKeymap["'"];
    ASCIIKeymap[";"]["/"] = ASCIIKeymap["/"];
    ASCIIKeymap[";"]["."] = ASCIIKeymap["."];
}

ASCIIKeymap["'"][";"] = ASCIIKeymap[";"];
ASCIIKeymap["'"]["["] = ASCIIKeymap["["];
ASCIIKeymap["'"]["]"] = ASCIIKeymap["]"];
ASCIIKeymap["'"]["/"] = ASCIIKeymap["/"];

{
    let {m, k, l} = ASCIIKeymap;
    Object.assign(ASCIIKeymap[","], {m, k, l});
    ASCIIKeymap[","]["."] = ASCIIKeymap["."];
}

ASCIIKeymap["."][","] = ASCIIKeymap[","];
ASCIIKeymap["."]["l"] = ASCIIKeymap["l"];
ASCIIKeymap["."][";"] = ASCIIKeymap[";"];
ASCIIKeymap["."]["/"] = ASCIIKeymap["/"];

ASCIIKeymap["/"]["."] = ASCIIKeymap["."];
ASCIIKeymap["/"][";"] = ASCIIKeymap[";"];
ASCIIKeymap["/"]["'"] = ASCIIKeymap["'"];

module.exports = ASCIIKeymap;

;(() => {
    let f = require("../methods.js");
    f.deepFreeze(module.exports);
})();