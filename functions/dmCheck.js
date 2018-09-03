/**

    cxBot.js Mr. Prog DM Checker
    Version: 1
    Author: AllusiveBox
    Date Created: 08/10/18
    Date Last Updated: 08/31/18
    Last Update By: Th3_M4j0r

**/

// Load in required Libraries and Files
const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const debug = require(`../functions/debug.js`);
const disabledDMs = require(`../functions/disabledDMs.js`);

/**
 * 
 * Checks if they are in a DM channel
 * If it was a DM, tells the user it was an invalid channel
 * @param {Discord.Message} message
 * @param {string} name
 * @returns {boolean} returns true if the message was in a DM channel
 */
module.exports.run = (message, name) => {
    if (message.channel.type === "dm") { // If Sent in DM...
        debug.log(`${name} command was used by ${message.author.username} in a DM.`);
        // Get Invalid Channel Message
        let invalidChannel = config.invalidChannel;
        message.author.send(invalidChannel).catch(error => {
            disabledDMs.run(message, invalidChannel);
        });
        return true;
    }
    return false;
}

/**
 * Checks if they are in a DM channel
 * does not send the user anything
 * @param {Discord.Message} message 
 * @returns {boolean} is the message a DM?
 */
module.exports.runQuiet = (message) => {
    return message.channel.type === "dm"
}
