const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const {
  GetUser,
  GetGlobalUser, handlemsg
} = require(`../../handlers/functions`)
const fetch = require("node-fetch")
module.exports = {
  name: "color",
  aliases: ["hexcolor"],
  category: "🔰 Info",
  description: "Get Hex Color Information",
  usage: "color <HEX CODE> | Example: color #ee33ff",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

		try {
      let userinfo = false;
      if(!args[0]){
        userinfo = true;
        args[0] = message.member.roles.highest.hexColor || "#000000";
      }
      const url = (`https://api.popcat.xyz/color/${args[0].includes("#") ? args[0].split("#")[1] : args[0] }`)
      let json;
      try {
        json = await fetch(url).then(res => res.json())
      } catch (e) {
        return message.reply({content: `${e.message ? e.message : e}`,
          codeBlock: "js"
        })
      }
      if (json.error) return message.reply({content: client.la[ls].cmds.info.color.invalid + `\n${json.error}`,
        codeBlock: "js"
      })
      const embed = new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["info"]["color"]["variable1"]))
        .addField('<:arrow:1002960432656568480> **Name**', "```"+json.name+"```", true)
        .addField("<:arrow:1002960432656568480> **Hex**",  "```"+json.hex+"```", true)
        .addField("<:arrow:1002960432656568480> **RGB**",  "```"+json.rgb+"```", true)
        .addField(`<:arrow:1002960432656568480> **${client.la[ls].cmds.info.color.brightershade}**`,  "```"+json.brightened +"```", true)
        .setThumbnail(json.color_image)
        .setColor(json.hex)
      if(userinfo) embed.addField("Color ==  your Highest Role!", `> Usage: \`${prefix}color ${args[0]}\``);
      message.reply({
        embeds: [embed]
      })
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