"use strict";
/**

    cxBot.js Mr. Prog audit log command
    Version: 1
    Author: Th3_M4j0r
    clearance: Mod+
    Default Enabled: Cannot be Disabled
    Date Started: 09/16/18
    Date Last Updated: 10/10/18
    Last Update By: Th3_M4j0r

**/
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const config = require("../files/config.json");
//command Stuff
const command = {
    adminOnly: false,
    bigDescription: ("Use this command to see a page of the audit log, "
        + "can take a page number as an argument.\nReturns:\n\t " + config.returnsDM),
    description: "DMs you a page of the audit log",
    enabled: null,
    fullName: "Audit",
    name: "audit",
    permissionLevel: "mod"
};
exports.help = command;
/**
 *
 * @param {Discord.GuildAuditLogsEntry} entry
 */
function format(entry) {
    if (entry.actionType == "DELETE") {
        return `\tTimestamp:${entry.createdAt.toString()}\n\tAction:${entry.action}`
            + `\n\tExecutor:${entry.executor.username}`;
    }
    else {
        return `\tTimestamp:${entry.createdAt.toString()}\n\tAction:${entry.action}`
            + `\n\tExecutor:${entry.executor.username}\n\tChanges:${JSON.stringify(entry.changes)}`;
    }
}
/**
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {betterSql} sql
 * */
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command`);
    if (dmCheck_js_1.run(message, command.fullName))
        return; //returns on DM channel 
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let startPos = 0;
    let page = 1;
    if (args[0] && !isNaN(Number(args[0])) && Number(args[0]) > 0) { //valid page number?
        startPos = (Number.parseInt(args[0]) - 1) * 5;
        page = Number(args[0]);
    }
    try {
        log_js_1.debug(`Fetching audit logs for ${message.guild.name}`);
        let audit = await message.guild.fetchAuditLogs();
        let entries = audit.entries.array();
        log_js_1.debug(`Attempting to Generate embed of entries ${startPos} through ${startPos + 4}`);
        let embed = new Discord.RichEmbed()
            .setTitle(`Page#${page}`)
            .setColor(config.auditColor)
            .addField(`Log#${startPos + 1}`, format(entries[startPos]))
            .addField(`Log#${startPos + 2}`, format(entries[startPos + 1]))
            .addField(`Log#${startPos + 3}`, format(entries[startPos + 2]))
            .addField(`Log#${startPos + 4}`, format(entries[startPos + 3]))
            .addField(`Log#${startPos + 5}`, format(entries[startPos + 4]));
        message.author.send({ embed }).catch(error => {
            log_js_1.error(error);
            message.channel.send(`I was unable to send the log to you, if this persists, inform ${config.about.author}\n`
                + `error type: ${error.toString()}`);
        });
    }
    catch (error) {
        log_js_1.error(error);
    }
}
exports.run = run;
;