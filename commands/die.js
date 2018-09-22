/*
    Command Name: die.js
    Function: Set bot status to invisible and stops accepting commands
    Clearance: Owner Only.
	Default Enabled: Cannot be Disabled
    Date Created: 10/27/17
    Last Updated: 09/15/18
    Last Update By: AllusiveBox

*/

// Load in Require Files
const Discord = require(`discord.js`);
const userids = require(`../files/userids.json`);
const log = require(`../functions/log.js`);

// Command Variables

// Misc. Variables
const name = "Die";

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {string[]} [args]
 * @param {sqlite} sql
 */
module.exports.run = (bot, message, args, sql) => {
    // Debug to Console
    log.debug(`I am inside the ${name} command.`);

    // Owner ID Check
    if (message.author.id !== userids.ownerID) { // If Not Owner...
        return log.debug(`Attempted use of ${name} by ${message.author.username}.`);
    } else {
        log.debug(`Terminating Bot. Goodbye.`);
        // Set Bot Status to Invisible, in Case Bot Doesn't Disconnect Right Away.
        bot.user.setStatus("invisible");

        // Cleanly Close the SQL Database
        sql.close();

        // Exit the Process, and Return an Error Code that Will Prevent Scripts from
        // Restarting, should they be set to automatically reboot the bot if it
        // Terminates. In this case, I Chose Error Code 88, but it could be anything
        return process.exit(88);
    }
}

module.exports.help = {
    name: "die",
    description: ("Set bot's status to invisible and then terminates script."),
    permissionLevel: "owner"
}
