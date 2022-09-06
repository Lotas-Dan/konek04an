const {
    MessageEmbed
} = require('discord.js')
const config = require('../../configs/config.json')

module.exports = {
    name: "2dass",
    category: "🔞 NSFW",
    usage: "2dass",
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

        let mArray = ['akaneko', 'hmtai']
        let method = mArray[Math.random() * mArray.length]
        if (method == 'akaneko') {
            const { nsfw } = require('akaneko')
            await nsfw.ass().then(owo => {
                message.reply({
                    content: `${owo}`
                });
            })
        } else {
            const hmtai = require('hmtai')
            const neko = new hmtai().nsfw
            await neko.ass().then(owo => {
                message.reply({
                    content: `${owo}`
                });
            })
        }
    }
}