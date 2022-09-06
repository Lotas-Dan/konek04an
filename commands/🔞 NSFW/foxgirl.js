const Discord = require('discord.js')
const config = require(`../../configs/config.json`)
const {
      MessageEmbed, MessageAttachment
} = require('discord.js')
module.exports = {
      name: "foxgirl",
      category: "🔞 NSFW",
      usage: "foxgirl",
      type: "anime",
      run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
            if (GuildSettings.NSFW === false) {
                  const x = new MessageEmbed()
                  .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.disabled.title)
                        .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, { prefix: prefix }))
                  return message.reply({ embeds: [x] });
            }
            
            if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["2danal"]["variable1"])).then(async (msg) => { message.react('💢'); msg.delete({ timeout: 3000 }) })
            
            const { nsfw } = require('akaneko')
            await nsfw.foxgirl().then(owo => {
                  message.reply({
                        content: `${owo}`
                  });
            })
      }
};