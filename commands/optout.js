﻿/*
    Command Name: optout.js
    Function: opt out from data collection
    Clearance: none
	Default Enabled: Cannot be disabled 
    Date Created: 05/23/18
    Last Updated: 09/15/18
    Last Update By: AllusiveBox

*/


// Load in Required Files
const config = require(`../files/config.json`);
const Discord = require(`discord.js`);
const enabled = require(`../files/enabled.json`);
const disabledDMs = require(`../functions/disabledDMs.js`);
const log = require(`../functions/log.js`);
;
const betterSql = require(`../classes/betterSql.js`);

// Command Required Files

// Misc. Variables
const name = "Opt-Out";


/**
 * 
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {?string[]} [args]
 * @param {betterSql} sql
 */
module.exports.run = async (bot, message, args, sql) => {

    // Debug to Console Log
    log.debug(`I am inside the ${name} Command.`);

    let row = await sql.getUserRow(message.author.id);

    if (!row) {
        log.debug(`Unable to locate any data for ${message.author.username}.`);
        let reply = `I am unable to locate any data on you. Please try again.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs.run(message, reply);
        });
    }
    //else row found


    if (row.optOut === 1) { //if opted out
        log.debug(`${message.author.username} attempted to opt-out while already opted out.`);
        let reply = `You are already opted out, ${message.author}. `
         + `To opt back in, use the ${config.prefix}optIn command.`;
        return message.author.send(reply).catch(error => {
            return disabledDMs.run(message, reply);
        });
    }

    //not opted out

    log.debug(`${message.author.username} is being opted-out`);
    await sql.optOutUser(message.author.id);
    let reply = `No further data on you will be collected, `
        + `however if you want any existing data to be deleted, `
        + `use the ${config.prefix}deleteMe command. If you `
        + `wish to have data collected again, use the `
        + `${config.prefix}optIn command`;
    return message.author.send(reply).catch(error => {
        return disabledDMs.run(message, reply);
    });

}

module.exports.help = {
    name: "optout",
    description: "Allows a user to opt out of data collection.",
    permissionLevel: "normal"
}