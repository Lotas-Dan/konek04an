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
  name: "s.autonsfw",
  category: "⚙️ Settings",
  aliases: ["sautonsfw", "autonsfw.s", "autonsfws"],
  cooldown: 5,
  usage: "s.autonsfw  -->  React with the Emoji for the right action",
  description: "This Setup allows you to send logs into a specific Channel, when someone enters a the Command: report",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

    try {
      first_layer()
      async function first_layer() {
        let menuoptions = [
          {
            value: "Enable Auto-Nsfw",
            description: `Define the Auto-Nsfw Channel`,
            emoji: "1004118485573570580"
          },
          {
            value: "Disable Auto-Nsfw",
            description: `Disable the Admin Auto-Nsfw`,
            emoji: "❌"
          },
          {
            value: "Type Anime/Real/All",
            description: "Change the Auto-Nsfw img type",
            emoji: "🎴"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Auto-Nsfw`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Auto-Nsfw-Setup!`,
            emoji: "1006298288452026488"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Automated Nsfw System!')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))

        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Auto NSFW Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/no-one-under-eighteen_1f51e.png', 'https://discord.gg/U5r2pMuRHG'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({ content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:996538231644491907> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}` })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype) {
          case "Enable Auto-Nsfw": {
            let tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable5"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable6"]))
                .setFooter(client.getFooter(es))]
            })
            var thecmd;
            await tempmsg.channel.awaitMessages({
              filter: m => m.author.id == message.author?.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
              .then(async collected => {
                var message = collected.first();
                if (!message) return message.reply("NO MESSAGE SENT");
                let channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  if (!channel.nsfw || channel.nsfw == undefined) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable7"]))
                        .setColor(es.wrongcolor)
                        .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                        .setFooter(client.getFooter(es))]
                    }
                    );
                  }
                  await client.settings.set(message.guild.id + `.autonsfw.channel`, channel.id)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable8"]))
                      .setColor(es.color)
                      .setDescription(`Posting now, every 60 Minutes`.substring(0, 2048))
                      .setFooter(client.getFooter(es))]
                  }
                  );
                }
                else {
                  return message.reply("NO CHANNEL PINGED");
                }
              })
              .catch(e => {
                console.error(e)
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-automeme"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
          } break;
          case "Disable Auto-Nsfw": {
            await client.settings.set(message.guild.id + `.autonsfw.channel`, "no")
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable10"]))
                .setColor(es.color)
                .setDescription(`I will not send automatic NSFW Images to a Channel anymore`.substring(0, 2048))
                .setFooter(client.getFooter(es))]
            }
            );
          } break;
          case "Type Anime/Real/All": {
            const menuoptions = [
              {
                value: 'all',
                description: 'Send all images types',
                emoji: '📯'
              },
              {
                value: 'anime',
                description: 'Send anime images only',
                emoji: '996577257881620531'
              },
              {
                value: 'real',
                description: 'Send real images only',
                emoji: '👤'
              }
            ]
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Click me to change img type!')
              .addOptions(
                menuoptions.map(option => {
                  let Obj = {
                    label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                    value: option.value.substring(0, 50),
                    description: option.description.substring(0, 50),
                  }
                  if (option.emoji) Obj.emoji = option.emoji;
                  return Obj;
                }))

            //define the embed
            let MenuEmbed = new Discord.MessageEmbed()
              .setColor(es.color)
              .setAuthor(client.getAuthor('Auto NSFW Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/no-one-under-eighteen_1f51e.png', 'https://discord.gg/U5r2pMuRHG'))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
            let used1 = false;
            //send the menu msg
            let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
              time: 90000
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
                if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
                client.disableComponentMessage(menu);
                used1 = true;
                handle_the_picks(menu?.values[0], menuoptiondata)
                await client.settings.set(message.guild.id+`.autonsfw.type`, menu.values[0])
              }
              else menu?.reply({ content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:996538231644491907> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}` })
            });
            
          } break;
          case "Show Settings": {
            let thesettings = await client.settings.get(message.guild.id + `.autonsfw`)
            const { channel, type } = thesettings
            // let method = await client.settings.get(message.guild.id + `.autonsfw.type`)
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable11"]))
                .setColor(es.color)
                .setDescription(`**Channel:** ${channel == "no" ? "Not Setupped" : `<#${channel}> | \`${channel}\``}\n**Image Type:** \`${type}\``.substring(0, 2048))
                .setFooter(client.getFooter(es))]
            }
            );
          } break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-autonsfw"]["variable13"]))]
      }
      );
    }
  },
};
