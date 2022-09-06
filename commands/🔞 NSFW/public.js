const {

} = require('discord.js')
const hmtai = require('hmtai')
const neko = new hmtai().nsfw

module.exports = {
    name: "public",
    category: "🔞 NSFW",
    usage: "publick",
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

        await neko.public().then(owo => {
            message.reply({
                content: `${owo}`
            });
        })
    }
}