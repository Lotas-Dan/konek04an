const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require("../../configs/emojis.json");
module.exports = {
  name: "toggleunknowncmd",
  aliases: ["unknowncmd", "unknowncmdinfo", "unknowninfo", "unknowncommandinfo"],
  category: "🚫 Administration",
  description: "Toggles if the Bot should send you an Informational Message, when the Command is NOT FOUND",
  usage: "toggleunknowncmd",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    
    try {

      await client.settings.set(`${message.guild.id}.unkowncmdmessage`, !GuildSettings.unkowncmdmessage);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(`<a:yes:996538231644491907> ${!GuildSettings.unkowncmdmessage ? "Enabled": "Disabled"} Unknown Command Information`)
        .setDescription(`${!GuildSettings.unkowncmdmessage ? "I will now send an Information when the Command is not found" : "I will not send Information of Unknown Commands"}`.substring(0, 2048))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleunknowncommandinfo"]["variable2"]))
       ]} );
    }
  }
};
