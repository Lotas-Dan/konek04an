const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`../../configs/config.json`);
const canvacord = require("canvacord");
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const anime = require('anime-actions');
module.exports = {
  name: "a.thinking",
  aliases: ["athinking", "animethinking", "anime-thinking"],
  category: "😳 Anime-Emotions",
  description: "Shows an Emotion-Expression in an Anime style",
  usage: "a.thinking",
  type: "self",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    
    if(GuildSettings.ANIME === false){
        return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
        ]});
    }
    //send new Message
    message.reply({embeds : [
        new MessageEmbed()
        .setColor(es.color)
        .setImage(await anime.thinking())
        // .setAuthor(`${message.author.username} is thinking`, message.author.displayAvatarURL({ dynamic: true }))
    ]}).catch(() => null)
      
  }
}