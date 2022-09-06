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
  name: "s.commands",
  category: "⚙️ Settings",
  aliases: ["scommands", "commands.s", "commandss"],
  cooldown: 5,
  usage: "s.commands  -->  React with the Emoji for the right action",
  description: "Enable/Disable specific Commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    try {
      function getMenuOptions() {
        return [
          {
            label: "ECONOMY",
            value: "ECONOMY",
            emoji: "💸",
            description: `${GuildSettings.ECONOMY ? "❌ Disable ECONOMY Commands" : "✅ Enable ECONOMY Commands"}`
          },
          {
            label: "SCHOOL",
            value: "SCHOOL",
            emoji: "🏫",
            description: `${GuildSettings.SCHOOL ? "❌ Disable SCHOOL Commands" : "✅ Enable SCHOOL Commands"}`
          },
          {
            label: "PROGRAMMING",
            value: "PROGRAMMING",
            emoji: "⌨️",
            description: `${GuildSettings.PROGRAMMING ? "❌ Disable PROGRAMMING Commands" : "✅ Enable PROGRAMMING Commands"}`
          },
          {
            label: "RANKING",
            value: "RANKING",
            emoji: "📈",
            description: `${GuildSettings.RANKING ? "❌ Disable RANKING Commands" : "✅ Enable RANKING Commands"}`
          },
          {
            label: "FUN",
            value: "FUN",
            emoji: "🕹️",
            description: `${GuildSettings.FUN ? "❌ Disable FUN Commands" : "✅ Enable FUN Commands"}`
          },
          {
            label: "MINIGAMES",
            value: "MINIGAMES",
            emoji: "🎮",
            description: `${GuildSettings.MINIGAMES ? "❌ Disable MINIGAMES Commands" : "✅ Enable MINIGAMES Commands"}`
          },
          {
            label: "ANIME",
            value: "ANIME",
            emoji: "<:baka:996577257881620531>",
            description: `${GuildSettings.ANIME ? "❌ Disable ANIME Commands" : "✅ Enable ANIME Commands"}`
          },
          {
            label: "NSFW",
            value: "NSFW",
            emoji: "🔞",
            description: `${GuildSettings.NSFW ? "❌ Disable NSFW Commands" : "✅ Enable NSFW Commands"}`
          },
        ];
      }
      function getMenuRowComponent() { 
        let menuOptions = getMenuOptions();
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click: enable/disable Command-Categories")
          .setMinValues(1)
          .setMaxValues(menuOptions.length)
          .addOptions(menuOptions.filter(Boolean))
        return [new MessageActionRow().addComponents(menuSelection)]
      }


      let embed = new Discord.MessageEmbed()
        .setTitle(`Setup the allowed/not-allowed Command-Categories of this Server`)
        .setColor(es.color)
        .setDescription(`**In the selection down below all Categories are listed**\n\n**Select it to either disable/enable it!**\n\n**You can select all (*at least 1*) Command-Categories if you want to disable/enable all of them at once!**`)

       //Send message with buttons
      let msg = await message.reply({   
        embeds: [embed], 
        components: getMenuRowComponent()
      });
      const collector = msg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author?.id == client.user.id, time: 180e3, max: 1 });
      collector.on("collect", async b => {
        if(b?.user.id !== message.author?.id)
        return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
     
        let enabled = 0, disabled = 0;
        for await (const value of b?.values) {
          let oldstate = GuildSettings[`${value.toUpperCase()}`];
          if(!oldstate) enabled++;
          else disabled++;
          GuildSettings[`${value.toUpperCase()}`] = !oldstate
        }
        await client.settings.set(message.guild.id, GuildSettings)
        GuildSettings = await client.settings.get(message.guild.id);
        b?.reply(`<a:yes:996538231644491907> **\`Enabled ${enabled} Command-Categories\` and \`Disabled ${disabled} Command-Categories\` out of \`${b?.values.length} selected Command-Categories\`**`)
      })
      collector.on('end', collected => {
        msg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
          msg.embeds[0]
            .setDescription(`${getMenuOptions().map(option => `> ${option.emoji} **${option.value}-Commands**: ${option.description.split(" ")[0] != "❌" ? `\`Are now disabled [❌]\`` : `\`Are now enabled [✅]\``}`).join("\n\n")}`)
        ], components: []}).catch((e)=>{})
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-commands"]["variable5"]))
      ]});
    }
  },
};

function getNumberEmojis() {
  return [
    "<:0:1005205975474643155>",
    "<:1:1005205973364916324>",
    "<:2:1005205971687182357>",
    "<:3:1005205969355165706>",
    "<:4:1005205967069257891>",
    "<:5:1005205965643198495>",
    "<:6:1005205964082905120>",
    "<:7:1005205962480680981>",
    "<:8:1005205960819757056>",
    "<:9:1005205959246884954>",
    "<:10:1005205957514645666>",
    "<:11:1005205956013080726>",
    "<:12:1005205954331148338>",
    "<:13:1005205952158519388>",
    "<:14:1005205950619205733>",
    "<:15:1005205949016985831>",
    "<:16:1005205946890469428>",
    "<:17:1005205945019801711>",
    "<:18:1005205943585349763>",
    "<:19:1005205941249126662>",
    "<:20:1005205939969851392>",
    "<:21:1005205938547986542>",
    "<:22:1005205936572469332>",
    "<:23:1005205935251263498>",
    "<:24:1005205933850374245>",
    "<:25:1005205932361404479>"
  ]
}
