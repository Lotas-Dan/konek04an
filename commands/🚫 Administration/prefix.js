const { MessageEmbed } = require(`discord.js`);
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const { dbEnsure } = require("../../handlers/functions")
module.exports = {
    name: `prefix`,
    category: `🚫 Administration`,
    description: `Let's you change the Prefix of the BOT`,
    usage: `prefix <NEW PREFIX>`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "server",
    run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
      
    try{
      //if no args return error
      if (!args[0])
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable2"]))
        ]});
      //if there are multiple arguments
      if (args[1])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable3"]))
        ]});
      //if the prefix is too long
      if (args[0].length > 5)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable4"]))
        ]});
      //set the new prefix
      await client.settings.set(`${message.guild.id}.prefix`, args[0]);
      //return success embed
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable5"]))
      ]});
  } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable6"]))
      ]});
  }
  }
};
