const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../configs/config.json`);
const ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);

module.exports = {
  name: "afk",
  category: "🔰 Info",
  aliases: ["awayfromkeyboard",],
  cooldown: 10,
  usage: "afk [TEXT]",
  description: "Set yourself AFK",
  type: "user",
  run: async (client, message, args, user, text, prefix) => {
    
    try {
      if(args[0]) await client.afkDB.set(`${message.guild.id+user.id}.message`, args.join(" "));
      await client.afkDB.set(`${message.guild.id+user.id}.stamp`, Date.now());
      message.reply(`You are now afk for: ${args.join(" ")}\n> **Tipp:** *Write \`[afk]\` infront of your Message to stay afk but still write*`);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable3"]))
      ]});
    }
  }
}
