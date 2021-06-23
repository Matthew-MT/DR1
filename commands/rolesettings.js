const m = require("../bot_modules/dr1_modules.js");
const c = require("../bot_modules/constructors.js");
const r = require("../bot_modules/resolvables.js");
const cd = require("../bot_modules/cooldowns.js");
const db = require("../bot_modules/dr1_mongodb.js");
const help = require("./help.js");
const rle = require("../command_fragments/fragments_role.js");
const commandName = m.utility.extractName(module.filename);
const compiler = require("../bot_modules/setup_functions.js").compiler;
const roleF = compiler.compile({
    "default": compiler.fallthrough([
        compiler.collector({
            "set": compiler.collector({
                "perms": rle.setRolePermissions,
                "permissions": rle.setRolePermissions,
                "assignable": compiler.collector({
                    "rank": rle.setRoleAssignableRank,
                    "ranks": rle.setRoleAssignableRank
                }, undefined, r.getRole)
            }, undefined, r.getRole)
        }, undefined, r.getRole),
        compiler.construct({
            "view": compiler.construct({
                "perms": rle.viewRolePermissions,
                "permissions": rle.viewRolePermissions,
                "assignable": compiler.construct({
                    "rank": rle.viewRoleAssignableRank,
                    "ranks": rle.viewRoleAssignableRank,
                    "default": rle.viewRoleAssignableRank
                })
            })
        })
    ])
});

module.exports = {
    desc: "Change which roles can be assigned using the \"role\" command.",
    extra: "Subcommands:\n"
        + "#rolesettings [names|ids] .set .perms|.permissions [level]:/n{Set the permission level of a role to the given level.}\n"
        + "#rolesettings [names|ids] .set .assignable (.rank(s)) [level]:/n{Set the level at which a user can self-assign this role.}\n"
        + "#rolesettings .view .perms|.permissions:/n{View the permission levels of all currently set roles."
        + " Excludes roles that have not been set or that have a permission level of zero.}\n"
        + "#rolesettings .view .assignable (.rank(s)):/n{View the current levels at which roles can be self-assigned."
        + " Excludes roles that have not been set or that have an assignable level of Infinity.}",
    default: Infinity,
    requiresGuild: true,
    exe: async function (serverData, message, userData, response = true) {
        if (userData == "help") {
            help.exe(serverData, message, commandName);
            return;
        }
        
        let permissionData = new c.PermissionData(
            serverData.commandLevs[commandName],
            m.utility.getMemberRank(message.member, serverData)
        ), temp = await roleF(serverData, userData, message.channel, message, permissionData);
        if (temp.success) cd.updateGlobalCollector(commandName);
        return temp.output;
    }
};