var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure, dbRemove, dbKeys
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "s.autowarn",
  category: "⚙️ Settings",
  aliases: ["sautowarn", "autowarn.s", "autowarns", "autowarnsystem"],
  cooldown: 5,
  usage: "s.autowarn --> React with the Emoji for the right action",
  description: "Enable / Disable Auto-Warn-Rules, on my Security Systems, like antispam, anticaps, antilinks, blacklist and more!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
  
    try {
      if(!GuildSettings.autowarn) {
        const defaultSettings = {
          autowarn: {
              antispam: false,
              antiselfbot: false,
              antimention: false,
              antilinks: false,
              antidiscord: false,
              anticaps: false,
              blacklist: false,
              ghost_ping_detector: false,
          }
        };
        await dbEnsure(client.settings, message.guild.id, defaultSettings);
        GuildSettings.autowarn = defaultSettings;
      }
      first_layer()
      async function first_layer(){
        function getMenuOptions(){
         
          return [
            {
              label: "Anti Spam",
              value: `antispam`,
              description: `${GuildSettings.autowarnantispam ? "Disable Auto warning if someone spams": "Enable Auto warning if someone spams"}`,
              emoji: `${GuildSettings.autowarnantispam ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Anti Mention",
              value: `antimention`,
              description: `${GuildSettings.autowarnantimention ? "Disable Auto warning if someone mentions": "Enable Auto warning if someone mentions"}`,
              emoji: `${GuildSettings.autowarnantimention ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Anti Links",
              value: `antilinks`,
              description: `${GuildSettings.autowarnantilinks ? "Disable Auto warning if someone send Links": "Enable Auto warning if someone send Links"}`,
              emoji: `${GuildSettings.autowarnantilinks ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Anti Discord",
              value: `antidiscord`,
              description: `${GuildSettings.autowarnantidiscord ? "Disable Auto warning if someone send Discord Links": "Enable Auto warning if someone Discord Links"}`,
              emoji: `${GuildSettings.autowarnantidiscord ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Anti Caps",
              value: `anticaps`,
              description: `${GuildSettings.autowarnanticaps ? "Disable Auto warning if someone send CAPS": "Enable Auto warning if someone send CAPS"}`,
              emoji: `${GuildSettings.autowarnanticaps ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Blacklist",
              value: `blacklist`,
              description: `${GuildSettings.autowarnblacklist ? "Disable Auto warn if someone send blacklist words": "Enable Auto warn if someone send blacklist word"}`,
              emoji: `${GuildSettings.autowarnblacklist ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Ghost Ping Detector",
              value: `ghost_ping_detector`,
              description: `${GuildSettings.autowarnghost_ping_detector ? "Disable Auto warning if someone ghost pings": "Enable Auto warning if someone ghost pings"}`,
              emoji: `${GuildSettings.autowarnghost_ping_detector ? "❌": "1004118485573570580"}`,
            },
            {
              label: "Anti Self Bot",
              value: `antiselfbot`,
              description: `${GuildSettings.autowarnantiselfbot ? "Disable the Self Bot Detector": "Enable the Self Bot Detector"}`,
              emoji: `${GuildSettings.autowarnantiselfbot ? "❌": "1004118485573570580"}`,
            },
          ]
        }
        let menuoptions = getMenuOptions();
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(menuoptions.length) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Select all Auto-Warn Rules you want to enable/disable') 
          .addOptions(menuoptions)
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Auto-Warn Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/prohibited_1f6ab.png', 'https://discord.gg/U5r2pMuRHG'))
          .setDescription('***Select all Auto-Warn Rules you want to enable/disable in the `Selection` down below!***\n> *The Warns will only be applied, if the responsible System for it, is enabled!*\n> **You must select at least 1 or more!**')
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        const collector = menumsg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author?.id == client.user.id, time: 180e3, max: 1 });
        collector.on("collect", async b => {
          if(b?.user.id !== message.author?.id)
          return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
       
          let enabled = 0, disabled = 0;
          for await (const value of b?.values) {
            let oldstate = GuildSettings.autowarn[`${value.toLowerCase()}`];
            if(!oldstate) enabled++;
            else disabled++;
            await client.settings.set(`${message.guild.id}.autowarn.${value.toLowerCase()}`, !oldstate)
          }
          b?.reply(`<a:yes:996538231644491907> **\`Enabled ${enabled} Auto-Warn-Rules\` and \`Disabled ${disabled} Auto-Warn-Rules\` out of \`${b?.values.length} selected Auto-Warn-Rules\`**`)
        })
        collector.on('end', collected => {
          menumsg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
            menumsg.embeds[0]
              .setDescription(`${getMenuOptions().map(option => `> ${option.emoji == "✅" ? "❌": "✅"} **${option.value}-Auto-Warn-Rules**: ${option.description.includes("disabled") ? `\`Now Disabled [❌]\`` : `\`Now Enabled [✅]\``}`).join("\n\n")}`)
          ], components: []}).catch((e)=>{})
        });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable40"]))
      ]});
    }
  },
};
