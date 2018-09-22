/**

    cxBot.js Mr. Prog Role Changing Script
    Version: 3
    Author: AllusiveBox
    Date Started: 08/11/18
    Date Last Updated: 09/22/18
    Last Update By: AllusiveBox

**/

// Load in Required Libraries and Files
const Discord = require(`discord.js`);
const roles = require(`../files/roles.json`);
const log = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Number} level
 */
module.exports.run = (bot, message, level) => {
    // Debug to Console
    log.debug(`I am in the changerole function.`);

    // Default Assignments
    let serverRoles = message.guild.roles;
    let member = message.member;
    let has = ` has been promoted to: `;

    if (!member) { // If Member Object is null...
        log.error(`Member object null for ${memeber.author.username}`);
        return message.channel.send(`${message.author}, I am unable to update your `
            + `roles at this time.`);
    }
    // Level Logic Check
    level = level < 10 ? '0' + level : level;
    // Get The Role
    let role = serverRoles.get(roles.levelUp[`${level}`]);
    if (!role) {
        return log.debug(`Role has not been defined for level ${level}...`);
    } else {
        role = role.ID;
    }
    member.addRole(role).catch(error => {
        return log.error(error);
    });
    log.debug(`${message.author.username}${has}${roles.levelUp[`${level}`].name}`);
    message.channel.send(`You have been promoted to `
        + `**__${roles.levelUp[`${level}`].name}!__**`);
}
