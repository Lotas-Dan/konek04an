const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require("../../configs/emojis.json");
module.exports = {
  name: "toggledisabled",
  aliases: [ "toggleshowdisabled", "disabledinfo" ],
  category: "🚫 Administration",
  description: "Toggles if the Bot help Message should show Disabled Commands or not [DEFAULT: true]",
  usage: "toggledisabled",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    
    try {
      let showDisabled = GuildSettings.showdisabled ? true : false;
      await client.settings.set(`${message.guild.id}.showdisabled`, !showDisabled);
      showDisabled = await client.settings.get(`${message.guild.id}.showdisabled`);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(`<a:yes:996538231644491907> ${showDisabled ? "Enabled": "Disabled"} Disabled-Cmds Showing`)
        .setDescription(`${showDisabled ? "I will now show disabled commands in the Help Menu" : "I will not show disabled Commands in the Help Menu"}`.substring(0, 2048))
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