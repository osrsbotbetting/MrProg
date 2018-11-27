"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabledDMs_js_1 = require("../functions/disabledDMs.js");
const dmCheck_js_1 = require("../functions/dmCheck.js");
const hasElevatedPermissions_js_1 = require("../functions/hasElevatedPermissions.js");
const log_js_1 = require("../functions/log.js");
const react_js_1 = require("../functions/react.js");
const userids = require("../files/userids.json");
const channels = require("../files/channels.json");
const command = {
    adminOnly: false,
    bigDescription: ("Returns the target's avatar as a DM to the user, "
        + "works with both a mention and their ID. Use only to "
        + "validate if it's safe for the server or not. **Do not abuse.**\n"
        + "Returns:\n\t"
        + "This command logs to the log channel."),
    description: "DMs you with a user's avatar",
    enabled: null,
    fullName: "Avatar",
    name: "avatar",
    permissionLevel: "mod"
};
exports.help = command;
async function run(bot, message, args, sql) {
    log_js_1.debug(`I am inside the ${command.fullName} command.`);
    if (dmCheck_js_1.run(message, command.fullName))
        return;
    if (!await hasElevatedPermissions_js_1.run(bot, message, command.adminOnly, sql))
        return;
    let member = message.mentions.members.first();
    if (!member) {
        log_js_1.debug(`No member mentioned trying by ID...`);
        let toCheck = args.slice(0).join(' ');
        if (message.guild.members.has(toCheck)) {
            log_js_1.debug(`Found a member by the given ID`);
            member = message.guild.members.get(toCheck);
        }
        else {
            let reply = (`I am sorry ${message.author}, either you did not mention a `
                + `valid member, used an incorrect ID, or the API returned a null user.\n`
                + `Please ask <@${userids.ownerID}> to investigate.`);
            await react_js_1.run(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs_js_1.run(message, reply);
            });
        }
    }
    log_js_1.debug(`Generating Avatar URL for ${member.user.username} and sending `
        + `it to ${message.author.username}.`);
    let logID = channels.log;
    if (!logID) {
        log_js_1.debug(`Unable to find log ID in channels.json. Looking for another log channel.`);
        let logChannel = message.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) {
            log_js_1.debug(`Unable to find any kind of log channel.`);
        }
        else {
            logID = logChannel.id;
        }
    }
    if (!logID) {
        await message.author.send(bot.users.get(member.id).avatarURL)
            .then(function () {
            return react_js_1.run(message);
        })
            .catch(error => {
            react_js_1.run(message, false);
            let reply = (`I am sorry, ${message.author}, I am unable to DM you.\n`
                + `Please check your privacy settings and try again.`
                + `Error: *${error.toString()}*`);
            return disabledDMs_js_1.run(message, reply);
        });
    }
    else {
        bot.channels.get(logID).send(bot.users.get(member.id).avatarURL)
            .then(function () {
            return react_js_1.run(message);
        })
            .catch(error => {
            react_js_1.run(message, false);
            let reply = (`I am sorry, ${message.author}, I was unable to log the message.\n`
                + `Error: *${error.toString()}*`);
            return message.channel.send(reply);
        });
    }
}
exports.run = run;