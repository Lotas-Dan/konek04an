var {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
module.exports = {
  name: "s.serverstats",
  category: "⚙️ Settings",
  aliases: ["sserverstats", "serverstats.s", "serverstatss", "statser"],
  cooldown: 5,
  usage: "s.serverstats  -->  React with the Emoji for the right action",
  description: "This Setup allows you to specify a Channel which Name should be renamed every 10 Minutes to a Member Counter of Bots, Users, or Members",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

    try {
      message.reply(`Redirecting to: \`setup-membercount\` ...`).then((msg)=>{
        setTimeout(()=>{msg.delete().catch(() => null)}, 3000)
      }).catch(() => null)
      require("./setup-membercount").run(client, message, args, cmduser, text, prefix, es, ls, GuildSettings);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
        ]
      });
    }
  },
};