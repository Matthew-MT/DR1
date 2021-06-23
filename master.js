const cp = require("child_process");

async function manage(child) {
    return new Promise(resolve => {
        console.log("[m] restarted");
        child.once("exit", () => {
            console.log("[m] exited");
            resolve();
        });
    });
}

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

;(async () => {
    while (1) {
        await manage(cp.fork("./DR1.js"));
        await wait(60000);
    }
})();

/*child.on("exit", () => {
    setTimeout(() => {
        child = cp.fork("./DR1.js");
    }, 60000);
});*/

//console.log("[m] exited");
//console.log("[m] restarted");