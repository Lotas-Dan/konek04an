const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const moment = require('moment');
const { GetUser, GetGlobalUser, handlemsg } = require(`../../handlers/functions`)
module.exports = {
  name: "serverbanner",
  aliases: ["sbanner"],
  category: "🔰 Info",
  description: "Get the Banner of the Server",
  usage: "serverbanner",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    
    try {   
      if(message.guild.banner) {
        let embed = new Discord.MessageEmbed()
          .setTitle(`**<:arrow:1002960432656568480> SERVER BANNER:**`)
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setDescription(`[Download Link](${message.guild.bannerURL({size: 1024})})${message.guild.discoverySplash ? ` | [Link of Discovery Splash Image](${message.guild.discoverySplashURL({size: 4096})})`: ""}\n> This is the Image which is shown on the Top left Corner of this Server, where you see the Channels!`)
          .setImage(message.guild.bannerURL({size: 4096}))
        message.reply({embeds: [embed]})
      } else {
        let embed = new Discord.MessageEmbed()
          .setTitle(`<:no:998643650378616963> **This Server has no Banner!**`)
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        message.reply({embeds: [embed]})
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}
