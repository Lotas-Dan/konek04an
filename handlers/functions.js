const Discord = require('discord.js');
const {
    Client,
    Collection,
    MessageEmbed,
    MessageAttachment,
    Permissions,
    MessageButton,
    MessageActionRow,
    MessageSelectMenu
} = require('discord.js');
const emoji = require(`${process.cwd()}/configs/emojis.json`);
const config = require(`${process.cwd()}/configs/config.json`);
const ee = require(`${process.cwd()}/configs/embed.json`);
const ms = require("ms")
const moment = require("moment")
const fs = require('fs')
const _ = require("lodash");

module.exports = {
    dbRemove,
    dbKeys,
    CheckGuild,
    create_transcript_buffer,
    handlemsg,
    ensure_economy_user,
    nFormatter,
    create_transcript,
    databasing,
    simple_databasing,
    change_status,
    check_voice_channels,
    check_created_voice_channels,
    create_join_to_create_Channel,
    shuffle,
    formatDate,
    delay,
    getRandomInt,
    duration,
    getRandomNum,
    format,
    swap_pages,
    swap_pages2,
    swap_pages2_interaction,
    swap_pages_data,
    escapeRegex,
    arrayMove,
    edit_Roster_msg,
    send_roster_msg,
    isValidURL,
    GetUser,
    GetRole,
    GetGlobalUser,
    parseMilliseconds,
    isEqual,
    dbEnsure,
    clearDBData,
    getDisabledComponents
}
async function clearDBData(client, key) {
    try { delete client.checking[key] } catch (e) { }
    console.log("CLEARING DBS for: ", key)
    async function cleardb(db, theKey) {
        await db?.delete(theKey);
    }
    await cleardb(client.database, key);
    await cleardb(client.notes, key)
    await cleardb(client.economy, key)
    await cleardb(client.invitesdb, key)
    await cleardb(client.premium, key)
    await cleardb(client.snipes, key)
    await cleardb(client.afkDB, key)
    await cleardb(client.stats, key) //dont clear stats
    await cleardb(client.modActions, key) //dont clear modactions
    await cleardb(client.userProfiles, key) //dont clear userprofiles
    await cleardb(client.settings, key)
    await cleardb(client.jtcsettings, key)
    await cleardb(client.roster, key)
    await cleardb(client.autosupport, key)
    await cleardb(client.menuticket, key)
    await cleardb(client.menuapply, key)
    await cleardb(client.apply, key)
    await cleardb(client.jointocreatemap, key)
    await cleardb(client.joinvc, key)
    await cleardb(client.setups, key)
    await cleardb(client.points, key)
    await cleardb(client.voicepoints, key)
    await cleardb(client.reactionrole, key)
    await cleardb(client.blacklist, key)
    await cleardb(client.customcommands, key)
    await cleardb(client.keyword, key)
    console.log("CLEARED DBS for: ", key)
}
//usage: await dbRemove(QuickMongoDB, "key", "a");
//with callbackfunction: await dbRemove(QuickMongoDB, "key", d => d.data == "a");
async function dbRemove(db, key, filter) {
    return new Promise(async (res) => {
        try {
            const data = await db.get(key);
            if (data == null) {
                return null;
            }
            if (!Array.isArray(data)) return res(null)
            // allow db.remove(key, d); and: db.remove(key, data => data.foo == "bar")
            const Findfunction = _.isFunction(filter) ? filter : (v) => filter === v;
            const DataIndex = data.findIndex(Findfunction);
            // If index found, remove it
            if (DataIndex > -1) {
                data.splice(DataIndex, 1);
            }
            let newData = await db.set(key, data);
            return res(newData);
        } catch {
            res(null);
        }
    })
}

function handlemsg(txt, options) {
    let text = String(txt);
    for (const option in options) {
        var toreplace = new RegExp(`{${option.toLowerCase()}}`, "ig");
        text = text.replace(toreplace, options[option]);
    }
    return text;
}
function isEqual(value, other) {
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
  const valueLen = type === "[object Array]" ? value.length : Object.keys(value).length;
  const otherLen = type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;
  const compare = (item1, item2) => {
    const itemType = Object.prototype.toString.call(item1);
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }
    else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };
  if (type === "[object Array]") {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }
  return true;
}
async function GetGlobalUser(message, arg){
    var errormessage = "<:no:998643650378616963> I failed finding that User...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        user = await client.getUser(args[0]).catch(() => null)
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = [], allmembers = [];
        var guilds = [...client.guilds.cache.values()];
        for await (const g of guilds){
          var members = g.members.cache.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan);
          for await (const m of members) { alluser.push(m.user.tag); allmembers.push(m); }
        }
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = allmembers.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = allmembers.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }
        user = await client.getUser(user.user.i).catch(() => null);
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
  }

function parseMilliseconds(ms) {
    if (typeof ms !== 'number') {
        throw new TypeError('Expected a number');
    }

    return {
        days: Math.trunc(ms / 86400000),
        hours: Math.trunc(ms / 3600000) % 24,
        minutes: Math.trunc(ms / 60000) % 60,
        seconds: Math.trunc(ms / 1000) % 60,
        milliseconds: Math.trunc(ms) % 1000,
        microseconds: Math.trunc(ms * 1000) % 1000,
        nanoseconds: Math.trunc(ms * 1e6) % 1000
    };
}

function isValidURL(string) {
    const args = string.split(" ");
    let url;
    for (const arg of args) {
        try {
            url = new URL(arg);
            url = url.protocol === 'http:' || url.protocol === 'https:';
            break;
        } catch (_) {
            url = false;
        }
    }
    return url;
};

async function GetUser(message, arg) {
    var errormessage = "<:no:998643650378616963> I failed finding that User..."
    return new Promise(async (resolve, reject) => {
        var args = arg, client = message.client;
        if(!client || !message) return reject("CLIENT IS NOT DEFINED")
        if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
        let user = message.mentions.users.first();
        if(!user && args[0] && args[0].length == 18) {
          user = await client.getUser(args[0]).catch(() => null);
          if(!user) return reject(errormessage)
          return resolve(user);
        }


    else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.tag).toLowerCase())
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = message.guild.members.cache.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          alluser = message.guild.members.cache.map(member => String(member.displayName + "#" + member.user.discriminator).toLowerCase())
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = message.guild.members.cache.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }

        user = await client.getUser(user.user.i).catch(() => null);
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
}

async function GetRole(message, arg){
    var errormessage = "<:no:998643650378616963> I failed finding that Role...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
      if(!user && args[0] && args[0].length == 18) {
        user = message.guild.roles.cache.get(args[0])
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = message.guild.roles.cache.map(role => String(role.name).toLowerCase())
        user = alluser.find(r => r.split(" ").join("").includes(args.join("").toLowerCase()))
        user = message.guild.roles.cache.find(role => String(role.name).toLowerCase() === user)
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
        if(!user) return reject(errormessage)
        return resolve(user);
      }
    })
  }

  async function GetGlobalUser(message, arg){
    var errormessage = "<:no:998643650378616963> I failed finding that User...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        user = await client.getUser(args[0]).catch(() => null)
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = [], allmembers = [];
        var guilds = [...client.guilds.cache.values()];
        for await (const g of guilds){
          var members = g.members.cache.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan);
          for await (const m of members) { alluser.push(m.user.tag); allmembers.push(m); }
        }
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = allmembers.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = allmembers.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }
        user = await client.getUser(user.user.i).catch(() => null);
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
  }


  /**
 * async function edit_Roster_msg
 * @param {*} client | The Discord Bot Client
 * @param {*} guild | The Guild to edit the Message at
 * @param {*} the_roster_db | the Database of the Roster
 * @returns true / false + edits the message
 */
async function edit_Roster_msg(client, guild, the_roster_db, pre) {
  try {
    //fetch all guild members
    await guild.members.fetch().catch(() => null);
    //get the roster data
    let es = await client.settings.get(guild.id + ".embed")
    let ls = await client.settings.get(guild.id + ".language")
    let guildData = await the_roster_db.get(guild.id);
    if (!guildData) return
    var data = guildData[pre]
    if (!data) return
    //get the EMBED SETTINGS
    //if the rosterchannel is not valid, then send error + return
    if (data.rosterchannel == "notvalid")
      return //console.log("Roster Channel not valid | :: | " + data.rosterchannel);
    //get the channel from the guild
    let channel = guild.channels.cache.get(data.rosterchannel)
    //get the channel from the client if not found from the guild
    if (!channel)
      channel = client.channels.cache.get(data.rosterchannel);
    //if the rosterchannel is not found, then send error + return
    if (!channel)
      return //console.log("Roster Channel not found | :: | " + data.rosterchannel);
    //if the defined message length is less then 2 try return error (not setupped)
    if (data.rostermessage.length < 5)
      return //console.log("Roster Message not valid | :: | " + data.rostermessage);
    //fetch the message from the channel
    let message = channel.messages.cache.get(data.rostermessage) || await channel.messages.fetch(data.rostermessage).catch(() => null) || false;
    //if the message is undefined, then send the message ;)
    if (!message || message == null || !message.id || message.id == null) return send_roster_msg(client, guild, the_roster_db, pre);
    //define a variable for the total break of the loop later
    let totalbreak = false;
    //define the embed
    let rosterembed = new Discord.MessageEmbed()
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
      .setTitle(String(data.rostertitle).substring(0, 256))
    //get rosterole and loop through every single role
    let rosterroles = data.rosterroles;
    //if there are no roles added add this to the embed
    if (rosterroles.length === 0)
      rosterembed.addField(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variablex_2"]), eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable2"]))
    //loop through every single role
    for (let j = 0; j < rosterroles.length; j++) {
      //get the role
      let role = await guild.roles.fetch(rosterroles[j]).catch(() => null)
      //if no valid role skip
      if (!role || role == undefined || !role.members || role.members == undefined) continue;
      //if the embed is too big break
      if (rosterembed.length > 5900) break;
      //get the maximum field value length on an variabel
      let leftnum = 1024;
      //if the length is bigger then the maximum length - the leftnumber
      if (rosterembed.length > 6000 - leftnum) {
        //set the left number to the maximumlength - the leftnumber
        leftnum = rosterembed.length - leftnum - 100;
      }

      //try to send the roster with the right style..
      if (data.rosterstyle == "1") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}> | \`${member.user.tag}\``)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "2") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}>`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "3") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} **${member.user.tag}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
          } catch (e) {
            console.error(e)
          }
        }

      } else if (data.rosterstyle == "4") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} **${member.user.username}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "5") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}> | \`${member.user.id}\``)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
            break;
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "6") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}> | **${member.user.username}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {

          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!thearray) return;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "7") {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}> | **${member.user.tag}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)

          } catch (e) {
            console.error(e)
          }
        }
      } else {
        //define the memberarray
        let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}> | \`${member.user.tag}\``)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) leftnum = 800;
          if (rosterembed.length > 5500) {
            totalbreak = true;
            break;
          }
          if (!guildData[pre].showallroles || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if (memberarray.length === 0) {
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
          } catch (e) {
            console.error(e)
          }
        }
      }

      //if a totalbreak happened, then return + edit the message
      if (totalbreak) return message.edit({ embeds: [rosterembed] }).catch(e => console.log("could not edit roster 1" + e));
    }
    //after the loop, edit the message
    message.edit({ embeds: [rosterembed] }).catch(e => console.log("! Could not edit roster 1" + e));

  } catch (e) {
    console.log("ROSTER_COULD NOT FIND THE MESSAGE".grey, e)
  }
}
async function send_roster_msg(client, guild, the_roster_db, pre) {
  //ensure the database
  const obj = {};
  obj[pre] = {
    rosterchannel: "notvalid", showallroles: false, rostermessage: "", rostertitle: "Roster",
    rosteremoji: "➤", rosterstyle: "1", rosterroles: [], inline: false,
  }
  await dbEnsure(the_roster_db, guild.id, obj)
  let es = await client.settings.get(guild.id + ".embed")
  let ls = await client.settings.get(guild.id + ".language")
  let guildData = await the_roster_db.get(guild.id);
  if (!guildData || !guildData[pre]) return;
  if (guildData[pre].rosterchannel == "notvalid") return;
  let channel = await client.channels.fetch(guildData[pre].rosterchannel).catch(() => null);
  //define the embed
  let rosterembed = new Discord.MessageEmbed()
    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
    .setTitle(String(guildData[pre].rostertitle).substring(0, 256))
    .setFooter(client.getFooter(es))
  //get rosterole and loop through every single role
  let rosterroles = guildData[pre].rosterroles;
  if (!rosterroles || rosterroles.length === 0) try {
    rosterembed.addField(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variablex_2"]), eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable2"]))
  } catch (e) {
    console.error(e)
  }
  for (let i = 0; i < rosterroles.length; i++) {
    //get the role
    let role = await guild.roles.fetch(rosterroles[i]).catch(() => null)
    //if no valid role skip
    if (!role || role == undefined || !role.members || role.members == undefined) continue;
    //if the embed is too big break
    if (rosterembed.length > 5900) break;
    //get the maximum field value length on an variabel
    let leftnum = 1024;
    //if the length is bigger then the maximum length - the leftnumber
    if (rosterembed.length > 6000 - leftnum) {
      //set the left number to the maximumlength - the leftnumber
      leftnum = rosterembed.length - leftnum - 100;
    }
    //define the memberarray
    let memberarray = role.members.map(member => `${guildData[pre].rosteremoji} <@${member.user.id}> | \`${member.user.tag}\``)
    //loopthrough the array for 20 members / page
    for (let i = 0; i < memberarray.length; i += 20) {
      var thearray = memberarray;
      if (rosterembed.length > 5000) leftnum = 800;
      if (rosterembed.length > 5500) {
        totalbreak = true;
        break;
      }
      if (!guildData[pre].showallroles || memberarray.length < 20)
        try {
          rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20 > 0 ? `\n${guildData[pre].rosteremoji} ***\`${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length - 20}\` other Members have this Role ...***` : ""}`.substring(0, 1024), guildData[pre].inline)
          break;
        } catch (e) {
          console.error(e)
        }
      else
        try {
          rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), guildData[pre].inline)
        } catch (e) {
          console.error(e)
        }
    }
    //if there are no members who have this role, do this
    if (memberarray.length === 0) {
      try {
        rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), guildData[pre].inline)
      } catch (e) {
        console.error(e)
      }
    }
  }
  channel.send({ embeds: [rosterembed] }).then(msg => {
    the_roster_db?.set(guild.id + "." + pre + ".rostermessage", msg.id);
    setTimeout(() => {
      edit_Roster_msg(client, guild, the_roster_db, pre)
    }, 500)
  }).catch(e => console.log("Couldn't send a message, give the Bot permissions or smt!"))
}

  async function create_transcript_buffer(Messages, Channel, Guild){
    return new Promise(async (resolve, reject) => {
      try{
        let baseHTML = `<!DOCTYPE html>` +
        `<html lang="en">` +
        `<head>` +
        `<title>${Channel.name}</title>` +
        `<meta charset="utf-8" />` +
        `<meta name="viewport" content="width=device-width" />` +
        `<style>mark{background-color: #202225;color:#F3F3F3;}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-300.woff);font-weight:300}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-400.woff);font-weight:400}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-500.woff);font-weight:500}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-600.woff);font-weight:600}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-700.woff);font-weight:700}body{font-family:Whitney,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:17px}a{text-decoration:none}a:hover{text-decoration:underline}img{object-fit:contain}.markdown{max-width:100%;line-height:1.3;overflow-wrap:break-word}.preserve-whitespace{white-space:pre-wrap}.spoiler{display:inline-block}.spoiler--hidden{cursor:pointer}.spoiler-text{border-radius:3px}.spoiler--hidden .spoiler-text{color:transparent}.spoiler--hidden .spoiler-text::selection{color:transparent}.spoiler-image{position:relative;overflow:hidden;border-radius:3px}.spoiler--hidden .spoiler-image{box-shadow:0 0 1px 1px rgba(0,0,0,.1)}.spoiler--hidden .spoiler-image *{filter:blur(44px)}.spoiler--hidden .spoiler-image:after{content:"SPOILER";color:#dcddde;background-color:rgba(0,0,0,.6);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-weight:600;padding:100%;border-radius:20px;letter-spacing:.05em;font-size:.9em}.spoiler--hidden:hover .spoiler-image:after{color:#fff;background-color:rgba(0,0,0,.9)}blockquote{margin:.1em 0;padding-left:.6em;border-left:4px solid;border-radius:3px}.pre{font-family:Consolas,"Courier New",Courier,monospace}.pre--multiline{margin-top:.25em;padding:.5em;border:2px solid;border-radius:5px}.pre--inline{padding:2px;border-radius:3px;font-size:.85em}.mention{border-radius:3px;padding:0 2px;color:#dee0fc;background:rgba(88,101,242,.3);font-weight:500}.mention:hover{background:rgba(88,101,242,.6)}.emoji{width:1.25em;height:1.25em;margin:0 .06em;vertical-align:-.4em}.emoji--small{width:1em;height:1em}.emoji--large{width:2.8em;height:2.8em}.chatlog{max-width:100%}.message-group{display:grid;margin:0 .6em;padding:.9em 0;border-top:1px solid;grid-template-columns:auto 1fr}.reference-symbol{grid-column:1;border-style:solid;border-width:2px 0 0 2px;border-radius:8px 0 0 0;margin-left:16px;margin-top:8px}.attachment-icon{float:left;height:100%;margin-right:10px}.reference{display:flex;grid-column:2;margin-left:1.2em;margin-bottom:.25em;font-size:.875em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;align-items:center}.reference-av{border-radius:50%;height:16px;width:16px;margin-right:.25em}.reference-name{margin-right:.25em;font-weight:600}.reference-link{flex-grow:1;overflow:hidden;text-overflow:ellipsis}.reference-link:hover{text-decoration:none}.reference-content>*{display:inline}.reference-edited-tst{margin-left:.25em;font-size:.8em}.ath-av-container{grid-column:1;width:40px;height:40px}.ath-av{border-radius:50%;height:40px;width:40px}.messages{grid-column:2;margin-left:1.2em;min-width:50%}.messages .bot-tag{top:-.2em}.ath-name{font-weight:500}.tst{margin-left:.3em;font-size:.75em}.message{padding:.1em .3em;margin:0 -.3em;background-color:transparent;transition:background-color 1s ease}.content{font-size:.95em;word-wrap:break-word}.edited-tst{margin-left:.15em;font-size:.8em}.attachment{margin-top:.3em}.attachment-thumbnail{vertical-align:top;max-width:45vw;max-height:225px;border-radius:3px}.attachment-container{height:40px;width:100%;max-width:520px;padding:10px;border:1px solid;border-radius:3px;overflow:hidden;background-color:#2f3136;border-color:#292b2f}.attachment-icon{float:left;height:100%;margin-right:10px}.attachment-filesize{color:#72767d;font-size:12px}.attachment-filename{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.embed{display:flex;margin-top:.3em;max-width:520px}.embed-color-pill{flex-shrink:0;width:.25em;border-top-left-radius:3px;border-bottom-left-radius:3px}.embed-content-container{display:flex;flex-direction:column;padding:.5em .6em;border:1px solid;border-top-right-radius:3px;border-bottom-right-radius:3px}.embed-content{display:flex;width:100%}.embed-text{flex:1}.embed-ath{display:flex;margin-bottom:.3em;align-items:center}.embed-ath-icon{margin-right:.5em;width:20px;height:20px;border-radius:50%}.embed-ath-name{font-size:.875em;font-weight:600}.embed-title{margin-bottom:.2em;font-size:.875em;font-weight:600}.embed-description{font-weight:500;font-size:.85em}.embed-fields{display:flex;flex-wrap:wrap}.embed-field{flex:0;min-width:100%;max-width:506px;padding-top:.6em;font-size:.875em}.embed-field--inline{flex:1;flex-basis:auto;min-width:150px}.embed-field-name{margin-bottom:.2em;font-weight:600}.embed-field-value{font-weight:500}.embed-thumbnail{flex:0;margin-left:1.2em;max-width:80px;max-height:80px;border-radius:3px}.embed-image-container{margin-top:.6em}.embed-image{max-width:500px;max-height:400px;border-radius:3px}.embed-footer{margin-top:.6em}.embed-footer-icon{margin-right:.2em;width:20px;height:20px;border-radius:50%;vertical-align:middle}.embed-footer-text{display:inline;font-size:.75em;font-weight:500}.reactions{display:flex}.reaction{display:flex;align-items:center;margin:.35em .1em .1em .1em;padding:.2em .35em;border-radius:8px}.reaction-count{min-width:9px;margin-left:.35em;font-size:.875em}.bot-tag{position:relative;margin-left:.3em;margin-right:.3em;padding:.05em .3em;border-radius:3px;vertical-align:middle;line-height:1.3;background:#7289da;color:#fff;font-size:.625em;font-weight:500}.postamble{margin:1.4em .3em .6em .3em;padding:1em;border-top:1px solid}body{background-color:#36393e;color:#dcddde}a{color:#0096cf}.spoiler-text{background-color:rgba(255,255,255,.1)}.spoiler--hidden .spoiler-text{background-color:#202225}.spoiler--hidden:hover .spoiler-text{background-color:rgba(32,34,37,.8)}.quote{border-color:#4f545c}.pre{background-color:#2f3136!important}.pre--multiline{border-color:#282b30!important;color:#b9bbbe!important}.preamble__entry{color:#fff}.message-group{border-color:rgba(255,255,255,.1)}.reference-symbol{border-color:#4f545c}.reference-icon{width:20px;display:inline-block;vertical-align:bottom}.reference{color:#b5b6b8}.reference-link{color:#b5b6b8}.reference-link:hover{color:#fff}.reference-edited-tst{color:rgba(255,255,255,.2)}.ath-name{color:#fff}.tst{color:rgba(255,255,255,.2)}.message--highlighted{background-color:rgba(114,137,218,.2)!important}.message--pinned{background-color:rgba(249,168,37,.05)}.edited-tst{color:rgba(255,255,255,.2)}.embed-color-pill--default{background-color:#4f545c}.embed-content-container{background-color:rgba(46,48,54,.3);border-color:rgba(46,48,54,.6)}.embed-ath-name{color:#fff}.embed-ath-name-link{color:#fff}.embed-title{color:#fff}.embed-description{color:rgba(255,255,255,.6)}.embed-field-name{color:#fff}.embed-field-value{color:rgba(255,255,255,.6)}.embed-footer{color:rgba(255,255,255,.6)}.reaction{background-color:rgba(255,255,255,.05)}.reaction-count{color:rgba(255,255,255,.3)}.info{display:flex;max-width:100%;margin:0 5px 10px 5px}.guild-icon-container{flex:0}.guild-icon{max-width:88px;max-height:88px}.metadata{flex:1;margin-left:10px}.guild-name{font-size:1.2em}.channel-name{font-size:1em}.channel-topic{margin-top:2px}.channel-message-count{margin-top:2px}.channel-timezone{margin-top:2px;font-size:.9em}.channel-date-range{margin-top:2px}</style>` +
        `<script>async function scrollToMessage(e,t){var o=document.getElementById("message-"+t);null!=o&&(e.preventDefault(),o.classList.add("message--highlighted"),window.scrollTo({top:o.getBoundingClientRect().top-document.body.getBoundingClientRect().top-window.innerHeight/2,behavior:"smooth"}),window.setTimeout(function(){o.classList.remove("message--highlighted")},2e3))}async function scrollToMessage(e,t){var o=document.getElementById("message-"+t);o&&(e.preventDefault(),o.classList.add("message--highlighted"),window.scrollTo({top:o.getBoundingClientRect().top-document.body.getBoundingClientRect().top-window.innerHeight/2,behavior:"smooth"}),window.setTimeout(function(){o.classList.remove("message--highlighted")},2e3))}async function showSpoiler(e,t){t&&t.classList.contains("spoiler--hidden")&&(e.preventDefault(),t.classList.remove("spoiler--hidden"))}</script>` +
        `<script>document.addEventListener('DOMContentLoaded', () => {document.querySelectorAll('.pre--multiline').forEach((block) => {hljs.highlightBlock(block);});});</script>` +
        `</head>`;
        let messagesArray = []
        let messagescount = Messages.length;
        let msgs = Messages.reverse(); //reverse the array to have it listed like the discord chat
        //now for every message in the array make a new paragraph!
        await msgs.forEach(async msg => {
            //Aug 02, 2021 12:20 AM
            if(msg.type == "DEFAULT"){
              let time = moment(msg.createdTimestamp).format("MMM DD, YYYY HH:mm:ss")
              let subcontent = `<div class="message-group">` +
              `<div class="ath-av-container"><img class="ath-av"src="${msg.author.displayAvatarURL({dynamic: true})}" /></div>` +
              `<div class="messages">` +
              `<span class="ath-name" title="${msg.author.username}" style="color: ${msg.member.roles.highest.hexColor};">${msg.author.tag}</span>`;
              if(msg.author?.bot) subcontent += `<span class="bot-tag">BOT</span>`;
              subcontent += `<span class="tst">ID: ${msg.author.id} | </span>` +
              `<span class="tst">${time} ${msg.editedTimestamp ? `(edited)` : msg.editedAt ? `(edited)` : ""}</span>` +
              `<div class="message">`;
              if (msg.content) {
                subcontent += `<div class="content"><div class="markdown"><span class="preserve-whitespace">${markdowntohtml(String(msg.cleanContent ? msg.cleanContent : msg.content).replace(/\n/ig, "<br/>"))}</div></div>`
              }
              if (msg.embeds[0]){
                  subcontent += `<div class="embed"><div class=embed-color-pill style=background-color:"${msg.embeds[0].color ? msg.embeds[0].color : "transparent"}"></div><div class=embed-content-container><div class=embed-content><div class=embed-text>`

                  if(msg.embeds[0].author){
                    subcontent += `<div class="embed-ath">`;
                    if(msg.embeds[0].author.iconURL){
                      subcontent += `<img class="embed-ath-icon" src="${msg.embeds[0].author.iconURL}">`
                    }
                    if(msg.embeds[0].author.name){
                      subcontent += `<div class="embed-ath-name"><span class="markdown">${markdowntohtml(String(msg.embeds[0].author.name).replace(/\n/ig, "<br/>"))}</span></div>`
                    }
                    subcontent += `</div>`
                  }if(msg.embeds[0].title){
                    subcontent += `<div class="embed-title"><span class="markdown">${markdowntohtml(String(msg.embeds[0].title).replace(/\n/ig, "<br/>"))}</span></div>`;
                  }
                  if(msg.embeds[0].description){
                    subcontent += `<div class="embed-description preserve-whitespace"><span class="markdown" style="color: rgba(255,255,255,.6) !important;">${markdowntohtml(String(msg.embeds[0].description).replace(/\n/ig, "<br/>"))}</span></div>`;
                  }
                  if(msg.embeds[0].image){
                    subcontent += `<div class="embed-image-container"><img class="embed-footer-image" src="${msg.embeds[0].image.url}"></div>`
                  }
                  if(msg.embeds[0].fields && msg.embeds[0].fields.length > 0){
                    subcontent += `<div class="embed-fields">`
                    for await (let field of msg.embeds[0].fields) {
                        subcontent += `<div class="embed-field ${field.inline ? `embed-field--inline` : ``}">`
                        if(field.key){
                          subcontent += `<div class="embed-field-name">${markdowntohtml(String(field.key).replace(/\n/ig, "<br/>"))}</div>`;
                        }
                        if(field.value){
                          subcontent += `<div class="embed-field-value">${markdowntohtml(String(field.value).replace(/\n/ig, "<br/>"))}</div>`;
                        }
                        subcontent += `</div>`
                    }
                    subcontent += `</div>`;
                  }
                  if(msg.embeds[0].footer){
                    subcontent += `<div class="embed-footer">`;
                    if(msg.embeds[0].footer.iconURL){
                      subcontent += `<img class="embed-footer-icon" src="${msg.embeds[0].footer.iconURL}">`
                    }
                    if(msg.embeds[0].footer.text){
                      subcontent += `<div class="embed-footer-text"><span class="markdown">${markdowntohtml(String(msg.embeds[0].footer.text).replace(/\n/ig, "<br/>"))}</span></div>`
                    }
                    subcontent += `</div>`
                  }
                  subcontent += `</div>`;
                  if(msg.embeds[0].thumbnail && msg.embeds[0].thumbnail.url){
                    subcontent += `<img class="embed-thumbnail" src="${msg.embeds[0].thumbnail.url}">`;
                  }
                  subcontent += `</div></div></div>`;
              }
              if (msg.reactions && msg.reactions.cache.size > 0){
                subcontent += `<div class="reactions">`
                for await (const reaction of msg.reactions.cache.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan)){
                  subcontent += `<div class=reaction>${reaction.emoji?.url ? `<img class="emoji emoji--small" src="${reaction.emoji?.url}" alt="${"<" + reaction.emoji?.animated ? "a" : "" + ":" + reaction.emoji?.name + ":" + reaction.emoji?.id + ">"}">` : reaction.emoji?.name.toString()}<span class="reaction-count">${reaction.count}</span></div>`
                }
                subcontent += `</div>`
              }
              subcontent += `</div></div></div>`
              messagesArray.push(subcontent);
            }
            if(msg.type == "PINS_ADD"){
              let time = moment(msg.createdTimestamp).format("MMM DD, YYYY HH:mm:ss")
              let subcontent = `<div class="message-group">` +
              `<div class="ath-av-container"><img class="ath-av"src="https://cdn-0.emojis.wiki/emoji-pics/twitter/pushpin-twitter.png" style="background-color: #000;filter: alpha(opacity=40);opacity: 0.4;" /></div>` +
              `<div class="messages">` +
              `<span class="ath-name" title="${msg.author.username}" style="color: ${msg.member.roles.highest.hexColor};">${msg.author.tag}</span>`;
              if(msg.author?.bot) subcontent += `<span class="bot-tag">BOT</span>`;
              subcontent += `<span class="tst" style="font-weight:500;color:#848484;font-size: 14px;">pinned a message to this channel.</span><span class="tst">${time}</span></div></div></div>`;
            messagesArray.push(subcontent);
            }
        });
        baseHTML += `<body><div class="info"><div class="guild-icon-container"> <img class="guild-icon" src="${Guild.iconURL({dynamic:true})}" />` +
          `</div><div class="metadata">` +
          `<div class="guild-name"><strong>Guild:</strong> ${Guild.name} (<mark>${Guild.id})</mark></div>` +
          `<div class="channel-name"><strong>Channel:</strong> ${Channel.name} (<mark>${Channel.id})</mark></div>` +
          `<div class="channel-message-count"><mark>${messagescount} Messages</mark></div>` +
          `<div class="channel-timezone"><strong>Timezone-Log-Created:</strong> <mark>${moment(Date.now()).format("MMM DD, YYYY HH:mm")}</mark> | <em>[MEZ] Europe/London</em></div>` +
          `</div></div>` +
          `<div class="chatlog">`;
          baseHTML += messagesArray.join("\n");
          baseHTML += `<div class="message-group"><div class="ath-av-container"><img class="ath-av"src="https://logosmarken.com/wp-content/uploads/2020/12/Discord-Logo.png" /></div><div class="messages"><span class="ath-name" style="color: #ff5151;">TICKET LOG INFORMATION</span><span class="bot-tag">✓ SYSTEM</span><span class="timestamp">Mind this Information</span><div class="message " ><div class="content"><div class="markdown"><span class="preserve-whitespace"><i><blockquote>If there are Files, Attachments, Videos or Images, they won't always be displayed cause they will be unknown and we don't want to spam an API like IMGUR!</blockquote></i></span></div></div></div></div></div></div></body></html>`;
        fs.writeFileSync(`${process.cwd()}/${Channel.name}.html`, baseHTML); //write everything in the docx file
        resolve(`${process.cwd()}/${Channel.name}.html`);
        return;
        async function markdowntohtml(tomarkdown){
          mentionReplace(tomarkdown.split(" "));
          async function mentionReplace(splitted){
            for await (arg of splitted){
              const memberatches = arg.match(/<@!?(\d+)>/);
              const rolematches = arg.match(/<@&(\d+)>/);
              const channelmatches = arg.match(/<#(\d+)>/);
              if (rolematches) {
                let role = Guild.roles.cache.get(rolematches[1])
                if(role){
                  let torpleace = new RegExp(rolematches[0], "g")
                  tomarkdown = tomarkdown.replace(torpleace, `<span title="${role.id}" style="color: ${role.hexColor};">@${role.name}</span>`);
                }
              }
              if(memberatches){
                let member = Guild.members.cache.get(memberatches[1])
                if(member){
                  let torpleace = new RegExp(memberatches[0], "g")
                  tomarkdown = tomarkdown.replace(torpleace, `<span class="mention" title="${member.id}">@${member.user.username}</span>`);
                }
              }
              if(channelmatches){
                let channel = Guild.channels.cache.get(channelmatches[1])
                if(channel){
                  let torpleace = new RegExp(channelmatches[0], "g")
                  tomarkdown = tomarkdown.replace(torpleace, `<span class="mention" title="${channel.id}">@${channel.name}</span>`);
                }
              }
            }
          }
          var output = "";
          var BLOCK = "block";
          var INLINE = "inline";
          var parseMap = [
            {
              // <p>
              pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
              replace: "$1<br/>",
              type: BLOCK,
            },
            {
              // <blockquote>
              pattern: /\n(?:&gt;|\>)\W*(.*)/g,
              replace: "<blockquote><p>$1</p></blockquote>",
              type: BLOCK,
            },
            {
              // <ul>
              pattern: /\n\s?\*\s*(.*)/g,
              replace: "<ul>\n\t<li>$1</li>\n</ul>",
              type: BLOCK,
            },
            {
              // <ol>
              pattern: /\n\s?[0-9]+\.\s*(.*)/g,
              replace: "<ol>\n\t<li>$1</li>\n</ol>",
              type: BLOCK,
            },
            {
              // <strong>
              pattern: /(\*\*|__)(.*?)\1/g,
              replace: "<strong>$2</strong>",
              type: INLINE,
            },
            {
              // <em>
              pattern: /(\*)(.*?)\1/g,
              replace: "<em>$2</em>",
              type: INLINE,
            },
            {
              // <a>
              pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
              replace: "$1<a href=\"$3\">$2</a>",
              type: INLINE,
            },
            {
              // <img>
              pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
              replace: "<img src=\"$2\" alt=\"$1\" />",
              type: INLINE,
            },
            {
              // <code>
              pattern: /`(.*?)`/g,
              replace: "<mark>$1</mark>",
              type: INLINE,
            },
          ];
          async function parse(string) {
            output = "\n" + string + "\n";
            parseMap.forEach(function(p) {
              output = output.replace(p.pattern, function() {
                return replace.call(this, arguments, p.replace, p.type);
              });
            });
            output = clean(output);
            output = output?.trim();
            output = output?.replace(/[\n]{1,}/g, "\n");
            return output || "\n" + string?.trim().replace(/[\n]{1,}/g, "\n") + "\n";
          }
          async function replace(matchList, replacement, type) {
            var i, $$;
            for (i in matchList) {
              if(!matchList.hasOwnProperty(i)) {
                continue;
              }
              replacement = replacement.split("$" + i).join(matchList[i]);
              replacement = replacement.split("$L" + i).join(matchList[i].length);
            }
            if(type === BLOCK) {
              replacement = replacement.trim() + "\n";
            }
            return replacement;
          }
          async function clean(string) {
            var cleaningRuleArray = [
              {
                match: /<\/([uo]l)>\s*<\1>/g,
                replacement: "",
              },
              {
                match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
                replacement: "$1",
              },
            ];
            cleaningRuleArray.forEach(function(rule) {
              string = string.replace(rule.match, rule.replacement);
            });
            return string;
          }

          let output__ = parse(tomarkdown);
          return output__;
        }
      }catch (e){
        reject(e);
        return;
      }
    })
}

function shuffle(a) {
    try {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}

function formatDate(date) {
    try {
        return new Intl.DateTimeFormat('en-US').format(date);
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}




function duration(duration, useMilli = false) {
    let remain = duration;
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
    let milliseconds = remain;
    let time = {
        days,
        hours,
        minutes,
        seconds,
        milliseconds
    };
    let parts = []
    if (time.days) {
        let ret = time.days + ' Day'
        if (time.days !== 1) {
            ret += 's'
        }
        parts.push(ret)
    }
    if (time.hours) {
        let ret = time.hours + ' Hr'
        if (time.hours !== 1) {
            ret += 's'
        }
        parts.push(ret)
    }
    if (time.minutes) {
        let ret = time.minutes + ' Min'
        if (time.minutes !== 1) {
            ret += 's'
        }
        parts.push(ret)

    }
    if (time.seconds) {
        let ret = time.seconds + ' Sec'
        if (time.seconds !== 1) {
            ret += 's'
        }
        parts.push(ret)
    }
    if (useMilli && time.milliseconds) {
        let ret = time.milliseconds + ' ms'
        parts.push(ret)
    }
    if (parts.length === 0) {
        return ['instantly']
    } else {
        return parts
    }
}

async function delay(delayInms) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayInms);
        });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}

function getRandomInt(max) {
    try {
      return Math.floor(Math.random() * Math.floor(max));
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }

function getRandomNum(min, max) {
    try {
        return Math.floor(Math.random() * Math.floor((max - min) + min));
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}
function format(millis) {
  var s = Math.floor((millis / 1000) % 60);
  var m = Math.floor((millis / (1000 * 60)) % 60);
  var h = Math.floor((millis / (1000 * 60 * 60)) % 24);
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  return h + ":" + m + ":" + s + " | " + Math.floor((millis / 1000)) + " Seconds"
}
function escapeRegex(str) {
  try {
      if (!str || typeof str != "string") return "";
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
      console.log(String(e.stack).grey.bgRed)
  }
}
function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}
function nFormatter(num, digits = 2) {
  const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
      return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

async function swap_pages(client, message, description, TITLE) {
    const settings = await client.settings.get(message.guild.id)
    let es = settings.embed;
    let prefix = settings.prefix
    let ls = settings.language;
    let cmduser = message.author;

    let currentPage = 0;
    //GET ALL EMBEDS
    let embeds = [];
    //if input is an array
    if (Array.isArray(description)) {
      try {
        let k = 20;
        for (let i = 0; i < description.length; i += 20) {
          const current = description.slice(i, k);
          k += 20;
          const embed = new MessageEmbed()
            .setDescription(current.join("\n"))
            .setTitle(TITLE)
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
          embeds.push(embed);
        }
        embeds;
      } catch (e){console.error(e)}
    } else {
      try {
        let k = 1000;
        for (let i = 0; i < description.length; i += 1000) {
          const current = description.slice(i, k);
          k += 1000;
          const embed = new MessageEmbed()
            .setDescription(current)
            .setTitle(TITLE)
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
          embeds.push(embed);
        }
        embeds;
      } catch (e){console.error(e)}
    }
    if (embeds.length === 0) return message.channel.send({embeds: [new MessageEmbed()
    .setTitle(`${emoji?.msg.ERROR} No Content added to the SWAP PAGES Function`)
    .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
    .setFooter(client.getFooter(es))]}).catch(() => null)
    if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(() => null)

    let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("1004028666335985794").setLabel("Back")
    let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
    let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('1002960432656568480').setLabel("Forward")
    let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
    let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
    const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
    //Send message with buttons
    let swapmsg = await message.channel.send({
        content: `***Click on the __Buttons__ to swap the Pages***`,
        embeds: [embeds[0]],
        components: allbuttons
    });
    //create a collector for the thinggy
    const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author?.id == client.user.id, time: 180e3 }); //collector for 5 seconds
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
        if(b?.user.id !== message.author?.id)
          return b?.reply({content: `<:no:998643650378616963> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
          //page forward
          if(b?.customId == "1") {
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage !== 0) {
                currentPage -= 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                await b?.deferUpdate();
              } else {
                  currentPage = embeds.length - 1
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              }
          }
          //go home
          else if(b?.customId == "2"){
            collector.resetTimer();
            //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
              currentPage = 0;
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
              await b?.deferUpdate();
          }
          //go forward
          else if(b?.customId == "3"){
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage < embeds.length - 1) {
                  currentPage++;
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              } else {
                  currentPage = 0
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              }

          }
          //go forward
          else if(b?.customId == "stop"){
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => null);
              await b?.deferUpdate();
              collector.stop("stopped");
          }
    });
    collector.on("end", (reason) => {
      if(reason != "stopped"){
        swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => null);
      }
    })
  }
async function swap_pages_data(client, message, description, TITLE, T_cmd = "Unkown") {
    let cmduser = message.author;
    let currentPage = 0;
    //GET ALL EMBEDS
    let embeds = [];
    //if input is an array
    if (Array.isArray(description)) {
        try {
            let k = 20;
            for (let i = 0; i < description.length; i += 20) {
                const current = description.slice(i, k);
                k += 20;
                const embed = new MessageEmbed()
                    .setDescription("```" + current.join("\n") + "```").setTitle(TITLE).setColor("BLURPLE").setFooter({ text: `Executed: ${T_cmd}` })
                embeds.push(embed);
            }
            embeds;
        } catch (e) { console.error(e) }
    } else {
        try {
            let k = 2000;
            for (let i = 0; i < description.length; i += 2000) {
                const current = description.slice(i, k);
                k += 2000;
                const embed = new MessageEmbed()
                    .setDescription("```" + current + "```")
                    .setTitle(TITLE)
                    .setColor("BLURPLE").setFooter({ text: `Executed: ${T_cmd}` })
                embeds.push(embed);
            }
            embeds;
        } catch (e) { console.error(e) }
    }
    if (embeds.length === 0) return message.channel.send({
        embeds: [new MessageEmbed()
            .setTitle(`${emoji?.msg.ERROR} No Content added to the SWAP PAGES Function`)
            .setColor("RED")]
    }).catch(() => null)
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => null)

    let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("1004028666335985794").setLabel("Back")
    let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
    let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('1002960432656568480').setLabel("Forward")
    let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
    let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
    const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
    //Send message with buttons
    let swapmsg = await message.channel.send({
        embeds: [embeds[0]],
        components: allbuttons
    });
    //create a collector for the thinggy
    const collector = swapmsg.createMessageComponentCollector({ filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author?.id == client.user.id, time: 180e3 }); //collector for 5 seconds
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
        if (b?.user.id !== message.author?.id)
            return b?.reply({ content: `<:no:998643650378616963> **Only the one who typed the cmd is allowed to react!**`, ephemeral: true })
        //page forward
        if (b?.customId == "1") {
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
                currentPage -= 1
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components] }).catch(() => null);
                await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components] }).catch(() => null);
                await b?.deferUpdate();
            }
        }
        //go home
        else if (b?.customId == "2") {
            collector.resetTimer();
            //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components] }).catch(() => null);
            await b?.deferUpdate();
        }
        //go forward
        else if (b?.customId == "3") {
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components] }).catch(() => null);
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components] }).catch(() => null);
                await b?.deferUpdate();
            }

        }
        //go forward
        else if (b?.customId == "stop") {
            await swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components) }).catch(() => null);
            await b?.deferUpdate();
            collector.stop("stopped");
        }
    });
    collector.on("end", (reason) => {
        if (reason != "stopped") {
            swapmsg.edit({ embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components) }).catch(() => null);
        }
    })
}
async function swap_pages2(client, message, embeds, tempmsg = false) {
    let currentPage = 0;
    let cmduser = message.author;
    if (embeds.length === 1) {
      if(tempmsg) tempmsg.edit({embeds: [embeds[0]]}).catch(() => null)
      else message.channel.send({embeds: [embeds[0]]}).catch(() => null)
      return
    }
    let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("1004028666335985794").setLabel("Back")
    let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
    let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('1002960432656568480').setLabel("Forward")
    let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
    let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
    const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
    let prefix = await client.settings.get(message.guild.id+".prefix");
    //Send message with buttons
    let swapmsg;

    if(tempmsg) swapmsg = await tempmsg.edit({
        content: `***Click on the __Buttons__ to swap the Pages***`,
        embeds: [embeds[0]],
        components: allbuttons
      }).catch(() => null)
    else swapmsg = await message.channel.send({
        content: `***Click on the __Buttons__ to swap the Pages***`,
        embeds: [embeds[0]],
        components: allbuttons
      });
    //create a collector for the thinggy
    const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author?.id == client.user.id, time: 180e3 }); //collector for 5 seconds
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
        if(b?.user.id !== message.author?.id)
          return b?.reply({content: `<:no:998643650378616963> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
          //page forward
          if(b?.customId == "1") {
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage !== 0) {
                currentPage -= 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                await b?.deferUpdate();
              } else {
                  currentPage = embeds.length - 1
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              }
          }
          //go home
          else if(b?.customId == "2"){
            collector.resetTimer();
            //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
              currentPage = 0;
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
              await b?.deferUpdate();
          }
          //go forward
          else if(b?.customId == "3"){
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage < embeds.length - 1) {
                  currentPage++;
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              } else {
                  currentPage = 0
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              }

          }
          //go forward
          else if(b?.customId == "stop"){
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => null);
              await b?.deferUpdate();
              collector.stop("stopped");
          }
    });
    collector.on("end", (reason) => {
      if(reason != "stopped"){
        swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => null);
      }
    })

  }
  function getDisabledComponents (MessageComponents) {
    if(!MessageComponents) return []; // Returning so it doesn't crash
    return MessageComponents.map(({components}) => {
        return new MessageActionRow()
            .addComponents(components.map(c => c.setDisabled(true)))
    });
  }
  async function swap_pages2_interaction(client, interaction, embeds) {
    let currentPage = 0;
    let cmduser = interaction?.member.user;
    if (embeds.length === 1) return interaction?.reply({ephemeral: true, embeds: [embeds[0]]}).catch(() => null)
    let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("1004028666335985794").setLabel("Back")
    let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
    let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('1002960432656568480').setLabel("Forward")
    let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
    let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
    const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
    let prefix = await client.settings.get(interaction?.member.guild.id+".prefix");
    //Send message with buttons
    let swapmsg = await interaction?.reply({
        content: `***Click on the __Buttons__ to swap the Pages***`,
        embeds: [embeds[0]],
        components: allbuttons,
        ephemeral: true
    });
    //create a collector for the thinggy
    const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author?.id == client.user.id, time: 180e3 }); //collector for 5 seconds
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
        if(b?.user.id !== cmduser.id)
          return b?.reply({content: `<:no:998643650378616963> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
          //page forward
          if(b?.customId == "1") {
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage !== 0) {
                currentPage -= 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                await b?.deferUpdate();
              } else {
                  currentPage = embeds.length - 1
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              }
          }
          //go home
          else if(b?.customId == "2"){
            collector.resetTimer();
            //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
              currentPage = 0;
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
              await b?.deferUpdate();
          }
          //go forward
          else if(b?.customId == "3"){
            collector.resetTimer();
            //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
              if (currentPage < embeds.length - 1) {
                  currentPage++;
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              } else {
                  currentPage = 0
                  await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => null);
                  await b?.deferUpdate();
              }

          }
          //go forward
          else if(b?.customId == "stop"){
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => null);
              await b?.deferUpdate();
              collector.stop("stopped");
          }
    });
    collector.on("end", (reason) => {
      if(reason != "stopped"){
        swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => null);
      }
    })

  }
async function databasing(client, guildid, userid) {
    return new Promise(async (res) => {
        if (!client || client == undefined || !client.user || client.user == undefined) return res(true);
        try {
            if (guildid) {

                await dbEnsure(client.customcommands, guildid, {
                    commands: []
                })
                await dbEnsure(client.keyword, guildid, {
                    commands: []
                })
                await dbEnsure(client.stats, guildid, {
                    commands: 0,
                    songs: 0
                });
                await dbEnsure(client.premium, guildid, {
                    enabled: false,
                    expireAt: null,
                    peramanent: false,
                })
                const ensureData = {
                    textchannel: "0",
                    voicechannel: "0",
                    category: "0",
                    message_cmd_info: "0",
                    message_queue_info: "0",
                    message_track_info: "0",
                    blacklist: {
                        whitelistedroles: [],
                        words: [],
                        enabled: true
                    }
                }
                for (let i = 0; i <= 100; i++) {
                    ensureData[`ticketsystem${i}`] = {
                        enabled: false,
                        guildid: guildid,
                        defaultname: "🎫・{count}・{member}",
                        messageid: "",
                        channelid: "",
                        parentid: "",
                        claim: {
                            enabled: false,
                            messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
                            messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
                        },
                        message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
                        adminroles: []
                    }
                }
                await dbEnsure(client.setups, guildid, ensureData);
                await dbEnsure(client.blacklist, guildid, {
                    words: [],
                    mute_amount: 5,
                    whitelistedchannels: [],
                });
                await dbEnsure(client.settings, guildid, {
                    prefix: config.prefix,
                    pruning: true,
                    requestonly: true,
                    autobackup: false,
                    channel: "996502147455791226",
                    adminlog: "no",
                    dailyfact: "no",
                    reportlog: "no",
                    aichat: "no",
                    autoembeds: [],
                    adminroles: [],
                    language: "en",

                    mute: {
                        style: "timeout",
                        roleId: "",
                        defaultTime: 60000,
                    },

                    warnsettings: {
                        ban: false,
                        kick: false,
                        roles: [
                            /*
                            { warncount: 0, roleid: "1212031723081723"}
                            */
                        ]
                    },
                    showdisabled: true,

                    FUN: true,
                    ANIME: true,
                    MINIGAMES: true,
                    ECONOMY: true,
                    SCHOOL: true,
                    NSFW: false,
                    RANKING: true,
                    PROGRAMMING: true,
                    antispam: {
                        enabled: true,
                        whitelistedchannels: [],
                        limit: 7,
                        mute_amount: 2,
                    },
                    antimention: {
                        enabled: true,
                        whitelistedchannels: [],
                        limit: 5,
                        mute_amount: 2,
                    },
                    antiemoji: {
                        enabled: true,
                        whitelistedchannels: [],
                        limit: 10,
                        mute_amount: 2,
                    },
                    anticaps: {
                        enabled: true,
                        whitelistedchannels: [],
                        percent: 75,
                        mute_amount: 2,
                    },
                    cmdadminroles: {
                        removetimeout: [],
                        timeout: [],
                        idban: [],
                        snipe: [],
                        listbackups: [],
                        loadbackup: [],
                        createbackup: [],
                        embed: [],
                        editembed: [],
                        editimgembed: [],
                        imgembed: [],
                        useridban: [],
                        addrole: [],
                        addroletoeveryone: [],
                        ban: [],
                        channellock: [],
                        channelunlock: [],
                        clear: [],
                        clearbotmessages: [],
                        close: [],
                        copymessage: [],
                        deleterole: [],
                        detailwarn: [],
                        dm: [],
                        editembeds: [],
                        editimgembeds: [],
                        embeds: [],
                        embedbuilder: [],
                        esay: [],
                        giveaway: [],
                        image: [],
                        imgembeds: [],
                        kick: [],
                        mute: [],
                        nickname: [],
                        unlockthread: [],
                        unarchivethread: [],
                        lockthread: [],
                        archivethread: [],
                        leavethread: [],
                        lockchannel: [],
                        unlockchannel: [],
                        jointhread: [],
                        jointhreads: [],
                        setautoarchiveduration: [],
                        tempmute: [],
                        permamute: [],
                        poll: [],
                        react: [],
                        removeallwarns: [],
                        removerole: [],
                        report: [],
                        say: [],
                        slowmode: [],
                        suggest: [],
                        ticket: [],
                        unmute: [],
                        unwarn: [],
                        updatemessage: [],
                        warn: [],
                        warnings: [],
                    },
                    antilink: {
                        enabled: false,
                        whitelistedchannels: [],
                        whitelistedlinks: [
                            "giphy.com/gifs",
                            "c.tenor.com",
                            "tenor.com/view",
                            "github?.com",
                            "mozilla.org",
                            "w3schools.com",],
                        mute_amount: 2,
                    },
                    antidiscord: {
                        enabled: false,
                        whitelistedchannels: [],
                        whitelistedlinks: [
                            "discord.gg/U5r2pMuRHG",
                            "discord.gg/djs",],
                        mute_amount: 2,
                    },
                    embed: {
                        "color": ee.color,
                        "thumb": true,
                        "wrongcolor": ee.wrongcolor,
                        "footertext": client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).name : ee.footertext,
                        "footericon": client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).iconURL({
                            dynamic: true
                        }) : ee.footericon,
                    },
                    logger: {
                        "channel": "no",
                        "webhook_id": "",
                        "webhook_token": ""
                    },
                    welcome: {
                        captcha: false,
                        roles: [],
                        channel: "nochannel",

                        secondchannel: "nochannel",
                        secondmsg: ":wave: {user} **Welcome to our Server!** :v:",


                        image: true,
                        custom: "no",
                        background: "transparent",
                        frame: true,
                        framecolor: "white",
                        pb: true,
                        invite: true,
                        discriminator: true,
                        membercount: true,
                        servername: true,
                        msg: "{user} Welcome to this Server",


                        dm: false,
                        imagedm: false,
                        customdm: "no",
                        backgrounddm: "transparent",
                        framedm: true,
                        framecolordm: "white",
                        pbdm: true,
                        invitedm: true,
                        discriminatordm: true,
                        membercountdm: true,
                        servernamedm: true,
                        dm_msg: "{user} Welcome to this Server"
                    },
                    leave: {
                        channel: "nochannel",

                        image: true,
                        custom: "no",
                        background: "transparent",
                        frame: true,
                        framecolor: "white",
                        pb: true,
                        invite: true,
                        discriminator: true,
                        membercount: true,
                        servername: true,
                        msg: "{user} left this Server",


                        dm: true,

                        imagedm: true,
                        customdm: "no",
                        backgrounddm: "transparent",
                        framedm: true,
                        framecolordm: "white",
                        pbdm: true,
                        invitedm: true,
                        discriminatordm: true,
                        membercountdm: true,
                        servernamedm: true,
                        dm_msg: "{user} left this Server"
                    },
                    botchannel: [],
                });
                await dbEnsure(client.jtcsettings, guildid, {
                    prefix: ".",
                    channel: "",
                    channelname: "{user}' Room",
                    guild: guildid,
                });
                await dbEnsure(client.stats, guildid, { commands: 0, songs: 0 });

            }
            if (userid) {
                await dbEnsure(client.settings, userid, {
                    dm: true,
                })
                await dbEnsure(client.stats, guildid + userid, {
                    ban: [],
                    kick: [],
                    mute: [],
                    ticket: [],
                    says: [],
                    warn: [],
                })
            }
            if (userid && guildid) {
                await dbEnsure(client.stats, guildid + userid, {
                    ban: [],
                    kick: [],
                    mute: [],
                    ticket: [],
                    says: [],
                    warn: [],
                })
                await dbEnsure(client.userProfiles, userid, {
                    id: userid,
                    guild: guildid,
                    totalActions: 0,
                    warnings: [],
                    kicks: []
                });
            }
            return res(e);;
        } catch (e) {
            res(e);
        }
        return res(true)
    })
}


function change_status(client) {
    try {
        client.user.setActivity(`${config.prefix}help | ${config.prefix}setup | ${totalGuilds} Guilds | ${Math.ceil(totalMembers / 1000)}k Members`, {
            type: "WATCHING",
            shardID: shard
        });
    } catch (e) {
        client.user.setActivity(`${config.prefix}help | ${config.prefix}setup | ${client.guilds.cache.size} Guilds | ${Math.ceil(client.users.cache.size / 1000)}k Members`, {
            type: "WATCHING",
            shardID: 0
        });
    }
}
// Check if there is a setup-jointocreate vc with members in it to create temp channels
async function check_voice_channels(client) {
    let rawData = await client.jtcsettings.all()
    const guilds = [...client.guilds.cache.values()]
        .filter(g => rawData.find(d => d.ID == g.id)?.data && typeof rawData.find(d => d.ID == g.id)?.data == "object")
        .filter(g => Object.entries(rawData.find(d => d.ID == g.id)?.data).filter(([key, value]) => value && value.channel && value.channel.length > 6).length > 0);
    if (!guilds || guilds.length == 0) return
    for await (const guild of guilds) {
        for await (const [key, value] of Object.entries(rawData.find(d => d.ID == guild.id)?.data).filter(([key, value]) => value && value.channel && value.channel.length > 6)) {

            let channel = guild.channels.cache.find(ch => ch.type == "GUILD_VOICE" && value.channel == ch.id)
            if (!channel) continue;

            try {
                let members = channel.members.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan);
                if (!members || members.length == 0) continue;
                for await (const member of members) {
                    let themember = await guild.members.fetch(member).catch(() => null);
                    if (!themember) continue;
                    create_join_to_create_Channel(client, themember.voice, key);
                }
            } catch (e) {
                console.error(e)
                continue;
            }
        }
    }
    return;
}

async function check_created_voice_channels(client) {
    let map = await client.jointocreatemap.all();
    for await (const guild of [...client.guilds.cache.values()].filter(g => g.channels && g.channels.cache?.size > 0)) {
        try {
            const vcs = guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE")
                .filter(vc => vc.members.size <= 0)
                .filter(ch => ch.id == map.find(d => d.ID == `tempvoicechannel_${ch.guild.id}_${ch.id}`)?.data).map(d => d)
            if (!vcs || vcs.length == 0) continue;
            for await (const vc of vcs) {
                try {
                    console.log(`CHECK CREATED :: CHECKMEMBERS ${vc.name}`)
                    await client.jointocreatemap.delete(`tempvoicechannel_${vc.guild.id}_${vc.id}`);
                    await client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
                    //move user
                    if (vc?.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                        vc.delete().catch(e => console.error(e))
                        console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"} DUE TO EMPTYNESS`.strikethrough.brightRed)
                        continue;
                    } else {
                        console.log(`I couldn't delete the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"} DUE TO EMPTYNESS`.strikethrough.brightRed)
                        continue;
                    }
                } catch (e) {
                    // console.log("Not in db")
                    continue;
                }
            }
        } catch (e) {
            continue;
            console.error(e)
        }
    }
    return;
}

async function create_join_to_create_Channel(client, voiceState, prekey) {
    let ls = await client.settings.get(voiceState.member.guild.id + ".language") || "en"
    let chname = await client.jtcsettings.get(voiceState.member.guild.id + `${prekey}.channelname`) || "{user}'s Room";

    //CREATE THE CHANNEL
    if (!voiceState.guild.me.permissions.has("MANAGE_CHANNELS")) {
        try {
            voiceState.member.user.send(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable10"]))
        } catch {
            try {
                let channel = guild.channels.cache.find(
                    channel =>
                        channel.type === "GUILD_TEXT" &&
                        channel.permissionsFor(guild.me).has("SEND_MESSAGES")
                );
                channel.send(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable11"])).catch(() => null)
            } catch { }
        }
        return;
    }
    const createOptions = {
        type: 'GUILD_VOICE',
        permissionOverwrites: [{
            //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
            id: voiceState.guild.id,
            allow: ['VIEW_CHANNEL', "CONNECT"],
        }],
        userLimit: voiceState.channel.userLimit,
        bitrate: voiceState.channel.bitrate,
    };
    //if there is a parent with enough size
    if (voiceState.channel.parent && voiceState.channel.parent.children.size < 50) {
        createOptions.parent = voiceState.channel.parentId;
        createOptions.permissionOverwrites = [
            {
                //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
                id: voiceState.guild.id,
                allow: ['VIEW_CHANNEL', "CONNECT"],
            },
            ...voiceState.channel.parent.permissionOverwrites.cache.values()
        ];
    }
    //add the user
    createOptions.permissionOverwrites.push({
        id: voiceState.id, //the user is allowed to change everything
        allow: ['MANAGE_CHANNELS', "VIEW_CHANNEL", "MANAGE_ROLES", "CONNECT"],
    });
    //remove permissionOverwrites, if needed
    while (createOptions.permissionOverwrites > 100) {
        createOptions.permissionOverwrites.shift();
    }
    const DateNow = Date.now();
    //Create the channel
    voiceState.guild.channels.create(String(chname.replace("{user}", voiceState.member.user.username)).substring(0, 32), createOptions).then(async vc => {
        console.log(`Created the Channel: ${String(chname.replace("{user}", voiceState.member.user.username)).substring(0, 32)} in: ${voiceState.guild ? voiceState.guild.name : "undefined"} after: ${Date.now() - DateNow}ms`.brightGreen)
        //add to the DB
        await client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, voiceState.id);
        await client.jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
        //move user
        if (vc?.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MOVE_MEMBERS) && voiceState.channel.permissionsFor(voiceState.guild.me).has(Permissions.FLAGS.MOVE_MEMBERS)) {
            await voiceState.setChannel(vc);
        }
        /*//move to parent
        if(vc?.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
          await vc.setParent(voiceState.channel.parent)
        }*/
        //add permissions
        if (vc?.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            await vc.permissionOverwrites.edit(voiceState.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true,
            }).catch(() => null);
        }
    })
}

//OLD VERSION
async function create_transcript(message, client, msglimit) {

    let messageCollection = new Collection(); //make a new collection
    let channelMessages = await message.channel.messages.fetch({ //fetch the last 100 messages
      limit: 100
    }).catch(() => null); //catch any error
    messageCollection = messageCollection.concat(channelMessages); //add them to the Collection
    let tomanymsgs = 1; //some calculation for the messagelimit
    if (Number(msglimit) === 0) msglimit = 100; //if its 0 set it to 100
    let messagelimit = Number(msglimit) / 100; //devide it by 100 to get a counter
    if (messagelimit < 1) messagelimit = 1; //set the counter to 1 if its under 1
    while (channelMessages.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
      if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
      tomanymsgs += 1; //add 1 to the counter
      let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
      channelMessages = await message.channel.messages.fetch({
        limit: 100,
        before: lastMessageId
      }).catch(() => null); //Fetch again, 100 messages above the already fetched messages
      if (channelMessages) //if its true
        messageCollection = messageCollection.concat(channelMessages); //add them to the collection
    }
    let msgs = messageCollection.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan).reverse(); //reverse the array to have it listed like the discord chat
    message.channel.send({files: [await create_transcript_buffer(msgs, message.channel, message.guild)]}).catch(() => null);
  }

/* async function dbEnsure(db, key, defaultObject) {
  return new Promise(async (res) => {
    if(lodash.isNil(defaultObject)) {
        throw new Error(`No default value for for "${key}"`)
    }

    const newData = lodash.clone(defaultObject);
    const r = UtilClass.getKeyMetadata(key);
    // get the current master data if
    let dbData = await db.get(r.master) || {};
    if(typeof dbData != "object") {
      console.error("No dbdata object , force setting it to one");
      dbData = {};
    }
    // if there is a target, check for the target
    if(r.target) {
        if(lodash.has(dbData, r.target)) {
            const pathData = lodash.get(dbData, r.target)
            const newPathData = await checkObjectDeep(pathData, newData);
            // something has changed
            if(newPathData) {
              lodash.set(dbData, r.target, newPathData);
              await db.set(r.master, dbData);
              console.log("CHANGES IN HERE 1".brightGreen);
              return res({ changed: true });
            }
            return res({ changed: false });
        }
        // if it's not in the dbData, then set it
        lodash.set(dbData, r.target, newData)
        console.log("CHANGES IN HERE 2".brightGreen);
        await db.set(r.master, dbData);
        return res({ changed: true });
    }
    const newPathData = await checkObjectDeep(dbData, newData);
    // something has changed
    if(newPathData) {
        await db.set(r.master, newPathData);
        console.log("CHANGES IN HERE 3".brightGreen);
        return res({ changed: true });
    }
    // return something
    return res({ changed: false });
  })

  async function checkObjectDeep(dd, data) {
    return new Promise(async (res) => {
        let changed = false;

        const visitNodes = (obj, visitor, stack = []) => {
          if (typeof obj === 'object') {
            for (let key in obj) {
              visitNodes(obj[key], visitor, [...stack, key]);
            }
          } else {
            visitor(stack.join('.').replace(/(?:\.)(\d+)(?![a-z_])/ig, '[$1]'), obj);
          }
        }

        visitNodes(data, (path, value) => {
          if(!lodash.has(dd, path)) {
            lodash.set(dd, path, value);
            changed = true;
            console.log(`NO PATH: ${path}`);
          }
        });

        if(changed) return res(dd);
        return res(false);
    })
  }
}*/

async function dbEnsure(db, key, data, debug = false) {
  return new Promise(async (res) => {
    const extraDelay = 5; //ms

    try {
      debug ? console.log(``) : null;
      if(db) {
        let path = null;
        if(key.includes(".")) {
          path = key.split(".").slice(1).join(".")
          key = key.split(".")[0];
        }
        if(_.isNil(data)) {
          return rej("No default value provided")
        }
        const masterData = await db.get(key) || {};
        // if there is a path do this
        if(!_.isNil(path)) {
          // dbEnsure(db, key, {}); // Make sure there is an object
          if(_.has(masterData, path)) {
            const pathData = _.get(masterData, path)
            const newPathData = checkObjectDeep(pathData, data);
            // something has changed
            if(newPathData) {
              _.set(masterData, path, newPathData);
              await db.set(key, masterData);
              await delay(extraDelay);
            }
            return res(true);
          }
          _.set(masterData, path, data)
          await db.set(key, masterData);
          await delay(extraDelay);
          return res(true);
        }
        // if its not an object
        if(!_.isObject(masterData)) {
          debug ? console.log("Masterdata not an object") : null;
          return res(true);
        }

        const newData = checkObjectDeep(masterData, data);
        // something has changed
        if(newData) {
          Object.assign(masterData, newData);
          await db.set(key, masterData);
          await delay(extraDelay);
        }

        return res(true);


        function checkObjectDeep(dd, data) {
          let changed = false;
          // Layer 1
          for (const [Okey_1, value_1] of Object.entries(data)) {
            debug && !dd[Okey_1] ? console.log(dd[Okey_1]) : null;
            if(!dd[Okey_1] && dd[Okey_1] === undefined) {
              debug ? console.log(`Does not include ${Okey_1} for the value: ${value_1}`) : null;
              dd[Okey_1] = value_1; changed = true;
            } else if(value_1 && typeof value_1 == "object") {
              // Layer 2
              for (const [Okey_2, value_2] of Object.entries(value_1)) {
                if(!dd[Okey_1][Okey_2] && dd[Okey_1][Okey_2] === undefined) {
                  debug ? console.log(`Does not include ${Okey_1}.${Okey_2} for the value: ${value_2}`) : null;
                  dd[Okey_1][Okey_2] = value_2; changed = true;
                } else if(value_2 && typeof value_2 == "object") {
                  // Layer 3
                  for (const [Okey_3, value_3] of Object.entries(value_2)) {
                    if(!dd[Okey_1][Okey_2][Okey_3] && dd[Okey_1][Okey_2][Okey_3] === undefined) {
                      debug ? console.log(`Does not include ${Okey_1}.${Okey_2}.${Okey_3} for the value: ${value_3}`) : null;
                      dd[Okey_1][Okey_2][Okey_3] = value_3; changed = true;
                    } else if(value_3 === "object") {
                      // Layer 4
                      for (const [Okey_4, value_4] of Object.entries(value_3)) {
                        if(!dd[Okey_1][Okey_2][Okey_3][Okey_4] && dd[Okey_1][Okey_2][Okey_3][Okey_4] === undefined) {
                          debug ? console.log(`Does not include ${Okey_1}.${Okey_2}.${Okey_3}.${Okey_4} for the value: ${value_4}`) : null;
                          dd[Okey_1][Okey_2][Okey_3][Okey_4] = value_4; changed = true;
                        } else if(value_4 === "object") {
                          continue;
                        } else continue;
                      }
                      // End of layer 4
                    } else continue;
                  }
                  // End of layer 3
                } else continue;
              }
              // End of layer 2
            } else continue;
          }
          if(changed) return dd;
          else return false;
        }

      } else {
        console.error(`[ ☁️ ] :: `.magenta + `DB_ERROR, not exists table provided`.bgRed);
        res(true);
      }

    } catch (e) {
      console.error("[ ☁️ ] :: ".magenta + "DB_ERROR".bgRed, key, e);
      res(true);
    }
  })
}

async function dbKeys(db, filter = null) {
    const data = await db.all();
    if (filter && _.isFunction(filter))
    return data.filter(filter).map(d => d.ID)
    else return data.map(d => d.ID);
}
async function simple_databasing(client, guildId, userId) {
    if (!client || client == undefined || !client.user || client.user == undefined) return;
    try {
        if (guildId && userId) {
            await dbEnsure(client.stats, guildId + userId, {
                ban: [],
                kick: [],
                mute: [],
                ticket: [],
                says: [],
                warn: [],
            })
        }
        if (userId) {
            await dbEnsure(client.settings, userId, { dm: true })
        }
        if (guildId) {
            await dbEnsure(client.stats, guildId, { commands: 0, songs: 0 })

            await dbEnsure(client.settings, guildId, {
                prefix: config.prefix,
                pruning: true,
                requestonly: true,
                autobackup: false,
                unkowncmdmessage: false,
                channel: '996502147455791226',
                language: 'en',
                warnsettings: {
                    ban: false,
                    kick: false,
                    roles: [
                        /*
                        { warncount: 0, roleid: "1212031723081723"}
                        */
                    ]
                },
                mute: {
                    style: 'timeout',
                    roleId: '',
                    defaultTime: 60000,
                },
                embed: {
                    "color": ee.color,
                    "thumb": true,
                    "wrongcolor": ee.wrongcolor,
                    "footertext": client.guilds.cache.has(guildId) ? client.guilds.cache.get(guildId).name : ee.footertext,
                    "footericon": client.guilds.cache.has(guildId) ? client.guilds.cache.get(guildId).iconURL({
                        dynamic: true
                    }) : ee.footericon,
                },
                adminlog: 'no',
                reportlog: 'no',
                autonsfw: {
                  channel: 'no',
                  type: 'all',
                },
                dailyfact: 'no',
                autoembeds: [],
                adminroles: [],

                showdisabled: true,

                FUN: true,
                ANIME: true,
                MINIGAMES: true,
                ECONOMY: false,
                SCHOOL: true,
                NSFW: false,
                RANKING: false,
                PROGRAMMING: true,

                cmdadminroles: {
                    removetimeout: [],
                    timeout: [],
                    idban: [],
                    snipe: [],
                    addroletorole: [],
                    addroletobots: [],
                    addroletohumans: [],
                    removerolefromrole: [],
                    removerolefrombots: [],
                    removerolefromhumans: [],
                    removerolefromeveryone: [],
                    listbackups: [],
                    loadbackup: [],
                    createbackup: [],
                    embed: [],
                    editembed: [],
                    editimgembed: [],
                    imgembed: [],
                    useridban: [],
                    addrole: [],
                    addroletoeveryone: [],
                    ban: [],
                    channellock: [],
                    channelunlock: [],
                    clear: [],
                    clearbotmessages: [],
                    close: [],
                    copymessage: [],
                    deleterole: [],
                    detailwarn: [],
                    dm: [],
                    editembeds: [],
                    editimgembeds: [],
                    embeds: [],
                    embedbuilder: [],
                    esay: [],
                    giveaway: [],
                    image: [],
                    imgembeds: [],
                    kick: [],
                    mute: [],
                    nickname: [],
                    unlockthread: [],
                    unarchivethread: [],
                    lockthread: [],
                    archivethread: [],
                    leavethread: [],
                    lockchannel: [],
                    unlockchannel: [],
                    jointhread: [],
                    jointhreads: [],
                    setautoarchiveduration: [],
                    tempmute: [],
                    permamute: [],
                    poll: [],
                    react: [],
                    removeallwarns: [],
                    removerole: [],
                    report: [],
                    say: [],
                    slowmode: [],
                    suggest: [],
                    ticket: [],
                    unmute: [],
                    unwarn: [],
                    updatemessage: [],
                    warn: [],
                    warnings: [],
                },
                botchannel: [],
            });
            await dbEnsure(client.customcommands, guildId, { commands: [] });
        }
        return;
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}

async function ensure_economy_user(client, guildId, userId) {
    await dbEnsure(client.economy, `${guildId}_${userId}`, {
        user: userId,
        work: 0,
        balance: 0,
        bank: 0,
        hourly: 0,
        daily: 0,
        weekly: 0,
        monthly: 0,
        beg: 0,
        crime: 0,
        rob: 0,
        items: {
            yacht: 0, lamborghini: 0, car: 0, motorbike: 0, bicycle: 0,
            nike: 0, tshirt: 0,
            mansion: 0, house: 0, dirthut: 0,
            pensil: 0, pen: 0, condom: 0, bottle: 0,
            fish: 0, hamster: 0, dog: 0, cat: 0,
        },
        black_market: {
            boost: {
                time: 0,
                multiplier: 1
            }
        }
    })
    let data = await client.economy.get(`${guildId}_${userId}`)
      //reset the blackmarket Booster if it's over!
    if (data.black_market.boost.time !== 0 && (86400000 * 2) - (Date.now() - data.black_market.boost.time) <= 0) {
      console.log(`Reset Multiplier from Black_Market for: ${userId} | TIME: ${(86400000 * 2) - (Date.now() - data.black_market.boost.time)}`)
      await client.economy.set(`${guildId}_${userId}.black_market.boost.multiplier`, 1);
      await client.economy.set(`${guildId}_${userId}.black_market.boost`, 0);
    }
}

async function CheckGuild(client, key) {
    return new Promise(async (res) => {
        try {
            let database = await client.database.get(key);
            if (!database) {
                client.checking[key] = true;
                console.log(`[ ] :: `.magenta + "First-Time-Setting: ", key)
                // ensure
                await client.database.set(key, true);
                await databasing(client, key);
                console.log(`[x] :: `.magenta + "First-Time-Setting: DONE ", key)
                client.checking[key] = false
                res(true);
            } else {
                client.checking[key] = false; // set it to false, just to be sure
                res(true);
            }
        } catch (e) {
            console.error(e);
            client.checking[key] = false; // set it to false, just to be sure
            res(false);
        }
    })
}
