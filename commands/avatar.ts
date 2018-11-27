/*
    Command Name: avatar.js
    Function: Returns a User's Avatar
    Clearance: Mod+
	Default Enabled: Cannot be disabled
    Date Created: 04/14/18
    Last Updated: 11/23/18
    Last Update By: AllusiveBox

*/

// Load in Required Files
import * as Discord from 'discord.js';
import { run as disabledDMs } from '../functions/disabledDMs.js';
import { run as dmCheck } from '../functions/dmCheck.js';
import { run as hasElevatedPermissions } from '../functions/hasElevatedPermissions.js';
import { debug, commandHelp } from '../functions/log.js';
import betterSql from '../classes/betterSql.js';
import { run as react } from '../functions/react.js';


import config = require('../files/config.json');
import userids = require('../files/userids.json');
import channels = require('../files/channels.json');

//command variables
const command : commandHelp = {
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
}


/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {betterSql} sql
 */
export async function run(bot: Discord.Client, message: Discord.Message, args: string[], sql: betterSql) {
    // Debug to Console
    debug(`I am inside the ${command.fullName} command.`);

    // DM Check
    if (dmCheck(message, command.fullName)) return; // Return on DM channel

    if (! await hasElevatedPermissions(bot, message, command.adminOnly, sql)) return;

    // Find out Who to Get Avatar of
    let member = message.mentions.members.first();

    if (!member) { // If No Member is Mentioned, or API Returns null...
        debug(`No member mentioned trying by ID...`);
        let toCheck = args.slice(0).join(' ');
        if (message.guild.members.has(toCheck)) {
            debug(`Found a member by the given ID`);
            member = message.guild.members.get(toCheck);
        } else {
            let reply = (`I am sorry ${message.author}, either you did not mention a `
                + `valid member, used an incorrect ID, or the API returned a null user.\n`
                + `Please ask <@${userids.ownerID}> to investigate.`);
            await react(message, false);
            return message.author.send(reply).catch(error => {
                return disabledDMs(message, reply);
            });
        }
    } // Valid Member was found
    debug(`Generating Avatar URL for ${member.user.username} and sending `
        + `it to ${message.author.username}.`);

    // Load in Log Channel ID
    let logID = channels.log;

    if (!logID) { // If no Log ID...
        debug(`Unable to find log ID in channels.json. Looking for another log channel.`);

        // Look for Log Channel in Server
        let logChannel = message.member.guild.channels.find(val => val.name === "log");
        if (!logChannel) { // IF Unable to Find Log channel...
            debug(`Unable to find any kind of log channel.`);
        } else {
            logID = logChannel.id;
        }
    }

    // Check if there is an ID Now...
    if (!logID) { // If no Log ID...
        await message.author.send(bot.users.get(member.id).avatarURL)
            .then(function () {
                return react(message);
            })
            .catch(error => {
                react(message, false);
                let reply = (`I am sorry, ${message.author}, I am unable to DM you.\n`
                    + `Please check your privacy settings and try again.`
                    + `Error: *${error.toString()}*`);
                return disabledDMs(message, reply);
            });
    } else {
        (<Discord.TextChannel>bot.channels.get(logID)).send(bot.users.get(member.id).avatarURL)
            .then(function () {
                return react(message);
            })
            .catch(error => {
                react(message, false);
                let reply = (`I am sorry, ${message.author}, I was unable to log the message.\n`
                    + `Error: *${error.toString()}*`);
                return message.channel.send(reply);
            });
    }
}


export { command as help };