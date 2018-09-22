/**

    cxBot.js Mr. Prog Kick Scripts
    Version: 4
    Author: AllusiveBox
    Date Created: 08/08/18
    Date Last Updated: 09/22/18
    Last Update By: AllusiveBox

**/

const Discord = require(`discord.js`);
const config = require(`../files/config.json`);
const roles = require(`../files/roles.json`);
const log = require(`../functions/log.js`);

/**
 * 
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Discord.GuildMember} member
 * @param {string} reason
 * @param {sqlite} sql
 */
module.exports.run = async (bot, message, member, reason, sql) => {
    // Debug to Console
    log.debug(`I am inside the kick function.`);

    let logchannelColor = config.logChannelColors.memberKick;

    // Load in the Log Channel ID
    let logID = channels.log;
    // Check if there was an ID Provided
    if (!logID) { // If no Log ID...
        log.debug(`Unable to find the log ID in channels.json.`
            + `Looking for another log channel.`);
        // Look for Log Channel in the Server
        //logID = member.guild.channels.find(`name`, `log`).id;
        logID = member.guild.channels.find(val => val.name === 'log').id; //changed to function, since other way is deprecated
    }

    // Get Avatar
    let avatar = member.user.avatarURL;

    // Build the Embed
    let kickedEmbed = new Discord.RichEmbed()
        .setDescription(`Member Kicked!`)
        .setColor(logchannelColor)
        .setThumbnail(avatar)
        .addField("Member Name", member.user.username)
        .addField("Member ID", member.user.id)
        .addField("Kicked On", new Date());

    // Check if there is an ID Now
    if (!logID) { // If no Log ID...
        bot.users.get(userids.ownerID).send(kickedEmbed);
    } else {
        bot.channels.get(logID).send(kickedEmbed);
    }

    log.debug(`Kicking ${member.user.username} from ${message.member.guild.name} `
        + `for ${reason}.`);
    member.kick(reason).catch(error => {
        log.error(error);
        return message.channel.send(`Sorry, ${message.author}, I could not kick `
            + `${member.user.username} because of ${error}.`);
    });
    return log.debug(`Kick Successful.`);
}

