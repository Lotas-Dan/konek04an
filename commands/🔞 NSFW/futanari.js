const Discord = require('discord.js')
const config = require(`../../configs/config.json`)
const {
  MessageEmbed
} = require('discord.js')
var superagent = require('superagent')
module.exports = {
  name: "futanari",
  category: "🔞 NSFW",
  usage: "futanari",
  type: "anime",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    if (GuildSettings.NSFW === false) {
      const x = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
          prefix: prefix
        }))
      return message.reply({
        embeds: [x]
      });
    }
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"])).then(async (msg) => { message.react('💢'); msg.delete({ timeout: 3000 }) })

    superagent.get('https://nekobot.xyz/api/image').query({
      type: 'futa'
    }).end((err, response) => {
      message.reply({
        content: `${response.body.message}`
      });
    });
  }
};