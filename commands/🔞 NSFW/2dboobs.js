const Discord = require('discord.js')
const config = require(`../../configs/config.json`)
const {
      MessageEmbed,
      MessageAttachment
} = require('discord.js')
var superagent = require('superagent')
module.exports = {
      name: "2dboobs",
      category: "🔞 NSFW",
      usage: "2dboobs",
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
            if (!message.channel.nsfw) return message.reply(eval(client.la[ls]["cmds"]["nsfw"]["2danal"]["variable1"])).then(async (msg) => {
                  message.react('💢');
                  msg.delete({
                        timeout: 3000
                  })
            })
            let mArray = ['hmtai', 'nekobot']
            let method = mArray[Math.floor(Math.random() * mArray.length)]
            if (method == 'hmtai') {
                  const hmtai = require('hmtai')
                  const neko = new hmtai().nsfw;
                  await neko.boobs().then(owo => {
                        message.reply({
                              content: `${owo}`
                        });
                  });

            } else {
                  superagent.get('https://nekobot.xyz/api/image').query({
                        type: 'hboobs'
                  }).end((err, response) => {
                        message.reply({
                              content: `${response.body.message}`
                        })
                  })
            }
      }
};