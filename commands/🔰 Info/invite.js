const {
	MessageEmbed, MessageButton, MessageActionRow
} = require("discord.js")
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`)
const dash = `\n❯ Version: ${config.konek0Version}`
module.exports = {
  name: "invite",
  category: "🔰 Info",
  aliases: ["add"],
  usage: "invite",
  description: "Gives you an Invite link for this Bot",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {


    try {
      let user = message.mentions.users.first() || client.user;
      if(user) {
        if(!user.bot) return message?.reply({ephemeral: true, content: "<:no:998643650378616963> You can't Invite a Normal user! **IT MUST BE A BOT**"})
        let button_public_invite = new MessageButton().setStyle('LINK').setEmoji("1002958493088759828").setLabel('Invite me').setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=837452033279`)
        let button_support_dc = new MessageButton().setStyle('LINK').setEmoji("996539552011395142").setLabel('Support Server').setURL("https://discord.gg/U5r2pMuRHG")//array of all buttons
        // let button_dash = new MessageButton().setStyle('LINK').setEmoji("867777823817465886").setLabel('Dashboard-Website').setURL("")//array of all buttons
        const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc/*, button_dash*/])]
        message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Invite: __**${user.tag}**__`)
            .setDescription(`||[*Click here for an Invitelink without Slash Commands*](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=835304549631)||`)
            .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=837452033279`)
            .setFooter(client.getFooter(`${user.username}`+dash, ""))],
          components: allbuttons
        });
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
