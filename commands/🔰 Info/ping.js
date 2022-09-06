const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const { handlemsg, getRandomNum } = require(`../../handlers/functions`);
var cp = require('child_process');
const dash = `\n❯ Version: ${config.konek0Version}`
module.exports = {
  name: "ping",
  category: "🔰 Info",
  aliases: ["latency"],
  cooldown: 2,
  usage: "ping",
  description: "Gives you information on how fast the Bot can respond to you",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    try {
      let oldate = Math.floor(Date.now() / 10)
      message.reply({embeds: [new MessageEmbed()
        .setColor(es.color)//.setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es.footertext+dash, es.footericon))
        .setTitle(handlemsg(client.la[ls].cmds.info.ping.m1))
      ]}).then(async (msg) => {
        let newtime = Math.floor(Math.floor(Date.now() / 10) - oldate);
        const dbping = await client.database.ping();
        console.log(`[${dbping}ms] | "ping" | DB PING RECEIVED`.brightRed);
        if(newtime < 0) newtime*=-1;
        msg.edit({embeds: [new MessageEmbed()
          .setColor(es.color)//.setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(/*"It Takes longer, because i am getting my host ping!"+*/dash, es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL()))
          .setTitle(handlemsg(client.la[ls].cmds.info.ping.m2, { botping: Math.floor(client.ws.ping + newtime), ping: Math.floor(newtime) + "ms", wsping: Math.floor(client.ws.ping)})+`\n\n<:database:1011755783362465932> Database Ping: \`${dbping}ms\``)
        ]}).catch(console.error)
      })
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