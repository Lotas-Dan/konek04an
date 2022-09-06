const {
  MessageEmbed, MessageActionRow
} = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const { MessageButton } = require('discord.js')
const dash = `\n❯ Version: ${config.konek0Version}`
module.exports = {
  name: "support",
  category: "🔰 Info",
  usage: "invite",
  description: "Sends you the Support Server Link",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    try {
      //
      let button_public_invite = new MessageButton().setStyle('LINK').setEmoji("1002958493088759828").setLabel('Invite me').setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=837452033279`)
      let button_support_dc = new MessageButton().setStyle('LINK').setEmoji("996539552011395142").setLabel('Support Server').setURL("https://discord.gg/U5r2pMuRHG")//array of all buttons
      const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc])]
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setTitle(client.la[ls].cmds.info.support.title)
          .setDescription(`After join our server, create a request on the <#996502060411387915> channel`)
          .setFooter(client.getFooter('Konek0'+dash, ''))
          .setURL("https://discord.com/oauth2/authorize?client_id=909114894601830400&scope=bot&permissions=837452033279")],
        components: allbuttons
      });
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
