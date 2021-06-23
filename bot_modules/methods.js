module.exports = {
    deepFreeze: function (o) {
        let cur_path = [o], keys = [Object.keys(cur_path[0])];
        while (cur_path.length) {
            if (typeof cur_path[cur_path.length - 1][keys[keys.length - 1][0]] == "object"
            && !Object.isFrozen(cur_path[cur_path.length - 1][keys[keys.length - 1][0]])) {
                cur_path.push(cur_path[cur_path.length - 1][keys[keys.length - 1].shift()]);
                keys.push(Object.keys(cur_path));
            } else if (keys[keys.length - 1].length) keys[keys.length - 1].shift();
            if (!keys[keys.length - 1].length) {
                keys.pop();
                Object.freeze(cur_path.pop());
            }
        }
        Object.freeze(o);
        return o;
    },
    wait: function (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    recursiveObjectStringify: function (object) {
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
    },
    recursiveObjectParse: function (string) {
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
};