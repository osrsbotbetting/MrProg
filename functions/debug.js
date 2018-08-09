/**

    cxBot.js Mr. Prog Debug Script
    Version: 3
    Author: AllusiveBox
    Date Created: 08/08/18
    Date Last Updated: 08/08/18

**/

// Load in required Libraries and Files
const fs = require(`fs`);
const enabled = require(`../files/enabled.json`);

module.exports.log = async (str) => {
  // Declare Necessary Variables
  let date = new Date();
  var stream = fs.createWriteStream("log.txt", {flags: 'a'});

  // Figure out Time
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  // Figure out the Date
  let D = date.getDate();
  var M = date.getMonth() + 1;
  let Y = date.getFullYear();

  // Format Time
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  // Format Date
  D = D < 10 ? '0' + D : D;
  M = M < 10 ? '0' + M : M;

  // Combine the String
  str = `${M}/${D}/${Y}: ${h}:${m}:${s}> ${str}\n`;

  // Write to Log File
  stream.write(`${str}`);
  stream.end();

  if (enabled.debug) console.log(str);
  return;
}
