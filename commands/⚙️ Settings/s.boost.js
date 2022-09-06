var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "s.boost",
  category: "⚙️ Settings",
  aliases: ["sboost", "boosts"],
  cooldown: 5,
  usage: "s.boost <Message/disable>",
  description: "Send a Boost 'Thank you' Message in the dm of a booster",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    try {
      await dbEnsure(client.settings, message.guild.id, {
        boost: {
          enabled: false,
          message: "",
          log: false,
          stopBoost: "<a:server_boost:1002956684743934093> {member} **stopped Boosting us..** <:Crying:1002956409018789958>",
          startBoost: "<a:server_boost:1002956684743934093> {member} **has boosted us!** <a:Light_Saber_Dancce:997956218884739112>",
          againBoost: "<a:server_boost:1002956684743934093> {member} **has boosted us again!** <:UwU_GT:996576792901075096>",
        }
      })

      if(!args[0]) return message.reply("Usage: setup-boost <Message/disable>");
      if(args[0].toLowerCase() == "disable") {
        await client.settings.set(message.guild.id+".boost.enabled", false)
        message.reply("Disabled the boost messages");
      }
      else {
        message.reply(`I will send a dm to each user if they boost this server with this message:\n${args.join(" ")}`.substring(0, 2000));
        await client.settings.set(message.guild.id+".boost.enabled", true)
        client.settings.set(message.guild.id+".boost.message", args.join(" "))
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
      ]});
    }
  },
};