const Discord = require('discord.js')
const {
  MessageEmbed
} = require('discord.js')
const config = require(`../../configs/config.json`)
var superagent = require('superagent');

module.exports = {
  name: "hass",
  category: "🔞 NSFW",
  usage: "hass",
  type: "anime",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    if(GuildSettings.NSFW === false) {
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
    if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["pussy"]["variable2"])).then(async (msg) => { message.react('💢'); msg.delete({ timeout: 3000 }) })

    superagent.get('https://nekobot.xyz/api/image').query({
      type: 'hass'
    }).end((err, response) => {
      message.reply({
        content: `${response.body.message}`
      });
    });
  }
};