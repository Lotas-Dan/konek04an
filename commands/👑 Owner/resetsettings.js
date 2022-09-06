var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
const fs = require('fs');
const fetch = require('node-fetch');
var {
  dbEnsure, isValidURL, databasing, clearDBData
} = require(`../../handlers/functions`);
module.exports = {
  name: "resetsettings",
  type: "info",
  category: "👑 Owner",
  aliases: ["resetallsettings", "hardreset"],
  cooldown: 5,
  usage: "resetsettings",
  description: "Reset (delete) All settings",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    
    if (!config.ownersIDS.some(r => r.includes(message.author?.id)))
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["resetsettings"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["owner"]["resetsettings"]["variable2"]))
        ]});
    try {
      message.channel.send({content : eval(client.la[ls]["cmds"]["owner"]["resetsettings"]["variable3"])}).then(msg=>{
        msg.channel.awaitMessages({filter: m => m.author.id == message.author?.id, max: 1, time: 30e3, errors: ["time"]}).then(async collected=>{
          if(collected.first().content.toLowerCase() == "yes"){

            await clearDBData(client, message.guild.id);
            await databasing(client, message.guild.id);
            //databasing(client, message.guild.id)
            var es = await client.settings.get(message.guild.id, "embed")
            var ls = await client.settings.get(message.guild.id, "language")
            return message.channel.send({embeds :[new MessageEmbed()
              .setColor(es.color)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["owner"]["resetsettings"]["variable4"]))
            ]});
          }else{
            return message.channel.send({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["owner"]["resetsettings"]["variable5"]))
            ]});
          }
        })
      })

    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["resetsettings"]["variable6"]))
      ]});
    }
  },
};
