const hmtai = require('hmtai')
const Discord = require('discord.js')
const neko = new hmtai().nsfw;
const {
  MessageEmbed
} = require('discord.js')
const config = require(`../../configs/config.json`)
module.exports = {
  name: "lewdneko",
  category: "🔞 NSFW",
  description: "Sends random nsfw neko",
  usage: "lewdneko",
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

    await neko.nsfwNeko().then(owo => {
      message.reply({
        content: `${owo}`
      });
    })
  }
};