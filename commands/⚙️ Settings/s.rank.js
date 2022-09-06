var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure,
  edit_msg,
  send_roster
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "s.rank",
  category: "⚙️ Settings",
  aliases: ["srank", "rank.s", "s.level", "s.levels", "s.leveling", "slevel", "slevels", "sleveling"],
  cooldown: 5,
  usage: "s.rank --> React with the Emoji for the right action",
  description: "Manage the Ranking System with stuff like channel, background, etc",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    return message.reply(client.la[ls].handlers.rankingjs.ranking.variable91);
    try {

      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Channel Levelup",
            description: `Define the a Channel for all Levelup Messages`,
            emoji: "1004118485573570580"
          },
          {
            value: "Reply on Levelup",
            description: `Set it that the Levelup Messages are getting replied`,
            emoji: "👻"
          },
          {
            value: "Disable Levelup",
            description: `Never send Levelup Information`,
            emoji: "❌"
          },
          {
            value: "Levelup Roles",
            description: `Manage Levelup Roles`,
            emoji: "💾"
          },
          {
            value: "Show Settings",
            description: `Show Settings of the Ranking System`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ranking-System-Setup!`,
            emoji: "1006298288452026488"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Ranking-System') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.getAuthor('Rank Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/page-with-curl_1f4c3.png', 'https://discord.gg/U5r2pMuRHG'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author?.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', async menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            client.disableComponentMessage(menu);
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menu?.values[0], SetupNumber, menuoptiondata)
          }
          else menu?.reply({content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:996538231644491907> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, menuoptiondata) {
        switch (optionhandletype) {
          case "Channel Levelup": {
            var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable6"]))
              .setFooter(client.getFooter(es))
            ]})
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  try {
                    await client.points.set(message.guild.id+".channel", channel.id, )
                    await client.points.set(message.guild.id+".disabled", false)
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable7"]))
                      .setColor(es.color)
                      .setFooter(client.getFooter(es))
                    ]});
                  } catch (e) {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable8"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable9"]))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } else {
                  throw "you didn't ping a valid Channel"
                }
              })
              .catch(e => {
                console.error(e);
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable10"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]});
              })
          }break;
          case "Reply on Levelup": {
            try {
              await client.points.set(message.guild.id+".channel", false)
              await client.points.set(message.guild.id+".disabled", false)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable11"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable12"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            } catch (e) {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable13"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable14"]))
                .setFooter(client.getFooter(es))
              ]});
            }
          }break;
          case "Disable Levelup": {
            try {
              if (await client.points.get(message.guild.id+".disabled")) return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable15"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable16"]))
                .setFooter(client.getFooter(es))
              ]});
              await client.points.set(message.guild.id+".disabled", true)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable17"]))
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable18"]))
                .setColor(es.color)
                .setFooter(client.getFooter(es))
              ]});
            } catch (e) {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable19"]))
                .setColor(es.wrongcolor)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable20"]))
                .setFooter(client.getFooter(es))
              ]});
            }
          }break;
          case "Levelup Roles": {
            await dbEnsure(client.points, message.guild.id, {
              rankroles: { }
            })
          var tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle("What do you want to do now?")
            .setColor(es.color)
            .addField("To __add__ a Rank Role send the Following:", 
            "> `LEVEL @ROLE`\nExample:\n > `3 @Level3` / `5 @LEVEL5`\n\n*After a Role has been set, you can just type this again to CHAGEN it!*")
            .addField("To __remove__ a Rank Role send the Following:", 
            "> `LEVEL`\nExample:\n > `3` / `5`")
            .setFooter(client.getFooter(es))
          ]})
          await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author?.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(async collected => {
              var message = collected.first();
              let arggs = message.content.trim().split(" ");
              if(!arggs[0] || isNaN(arggs[0])) return message.reply("**:x: YOU DID WRONG! Please read what the introduction tells you!**\nCancelled!")
              var Role = message.mentions.roles.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.roles.cache.get(arggs[1]);
                try {
                  let oldRankRoles = await client.points.get(message.guild.id+".rankroles");
                  if(!arggs[1] && oldRankRoles[parseInt(arggs[0])]){
                    delete oldRankRoles[parseInt(arggs[0])]
                    await client.points.set(message.guild.id+".rankroles", oldRankRoles);
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`**REMOVED** the Levelup-Role: ${Role.name} for the Levelup-Level: ${parseInt(arggs[0])}`)
                      .setColor(es.color)
                      .setDescription(`To add it back type: \`${prefix}s.rank\` --> 4️⃣ -->  \`${parseInt(arggs[0])} @${Role.name}\``)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else if(arggs[1] && oldRankRoles[parseInt(arggs[0])]){
                    oldRankRoles[parseInt(arggs[0])] = Role.id;
                    await client.points.set(message.guild.id+".rankroles", oldRankRoles);
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`**CHANGE** the Levelup-Role: ${Role.name} for the Levelup-Level: ${parseInt(arggs[0])}`)
                      .setColor(es.color)
                      .setDescription(`To add it back type: \`${prefix}s.rank\` --> 4️⃣ -->  \`${parseInt(arggs[0])} @${Role.name}\``)
                      .setFooter(client.getFooter(es))
                    ]});
                  } else {
                    oldRankRoles[parseInt(arggs[0])] = Role.id;
                    await client.points.set(message.guild.id+".rankroles", oldRankRoles);
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`**ADDED** the Levelup-Role: ${Role.name} for the Levelup-Level: ${parseInt(arggs[0])}`)
                      .setColor(es.color)
                      .setDescription(`To remove it type: \`${prefix}s.rank\` --> 4️⃣ -->  \`${parseInt(arggs[0])}\``)
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable8"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable9"]))
                    .setFooter(client.getFooter(es))
                  ]});
                }
            })
            .catch(e => {
              console.error(e)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable10"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                .setFooter(client.getFooter(es))
              ]});
            })
          }break;
          case "Show Settings": {

            await dbEnsure(client.points, message.guild.id, {
              rankroles: {
                  
              }
            })
            let rankroles = [];
            let rolesdata = await client.points.get(message.guild.id+".rankroles")
            let channel = await client.points.get(message.guild.id+".channel")
            let disabled = await client.points.get(message.guild.id+".disabled")
            for await (const [key, value] of Object.entries(rolesdata)){
              rankroles.push(`\`${key}\`. <@&${value}>`)
            }
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Settings of the Ranking System")
              .setColor(es.color)
              .addField("**Levelup-Message**", `> Disabled: ${!disabled ? "NO (ACTIVE)" : "Yes (DISABLED)"}\n> **Reply in ${channel ? `<#${channel}>`: "the same Channel"}**`)
              .setDescription(`**Level up Roles:**\n>>> ${rankroles.length > 0 ? rankroles.join("\n") : "\`NONE\`"}`.substring(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          }break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-rank"]["variable36"]))
      ]});
    }
  },
};