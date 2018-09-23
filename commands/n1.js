﻿/*
    Command Name: ping.js
    Function: Test if Bot is Online
    Clearance: none
	Default Enabled: Yes
    Date Created: 05/19/18
    Last Updated: 09/15/18
    Last Updated By: AllusiveBox

*/

// Load in Required Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const enabled = require(`../files/enabled.json`);
const log = require(`../functions/log.js`);

// Command Stuff
inviteLink = config.n1gpLink;

// Misc Variables
const name = "N1GP";

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */

module.exports.run = async (bot, message) => {
    // Debug to Console
    log.debug(`I am inside the ${name} command.`);

    // Enabled Command Test
    if (!enabled.n1) {
        return disabledCommand.run(name, message);
    }

    return message.author.send(inviteLink).catch(error => {
        disabledDMs.run(message, inviteLink);
    });
}

module.exports.help = {
    name: "n1",
    description: "Provides a link to the N1GP server.",
    permissionLevel: "normal"
}