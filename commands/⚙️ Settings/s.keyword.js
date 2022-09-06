var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure,
  dbRemove
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "s.keyword",
  category: "⚙️ Settings",
  aliases: ["skeyword", "keyword.s", "s.keyword"],
  cooldown: 5,
  usage: "s.keyword  --> React with the Emoji for the right action",
  description: "Define Key Word messages, so that if someone sends a Message containing that Keyword, the Bot will responde with your defined MESSAGE",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

    try {
      var originalowner = message.author?.id;
      let timeouterror;
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      await dbEnsure(client.keyword, message.guild.id, {
        commands: [
          /*
            {
              name: msg,
              output: "ye",
              embeds: false,
              channels: [],
              aliases: []
            }
          */
        ]
      })
      first_layer()
      async function first_layer() {
        let menuoptions = [{
          value: "Create Keyword",
          description: `Create a Keyword of your Choice`,
          emoji: "1004118485573570580"
        },
        {
          value: "Delete Keyword",
          description: `Delete one of the Keyword(s)`,
          emoji: "1006298288452026488"
        },
        {
          value: "Show Settings",
          description: `Show all Keywords!`,
          emoji: "📑"
        }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Automated Embed System!')
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
          .setAuthor(client.getFooter('Keyword Setup', 'https://images-ext-1.discordapp.net/external/HF-XNy3iUP4D95zv2fuTUy1csYWuNa5IZj2HSCSkvhs/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'https://discord.gg/U5r2pMuRHG'))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
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
        switch (optionhandletype) { // return message.reply
          case "Create Keyword": {
            let cmds = await client.keyword.get(message.guild.id+".commands");
            if (cmds && cmds.length > 24)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable5"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`You cannot have more then **24** Key Words`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable6"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable7"]))
                .setFooter(client.getFooter(es))]
            })
            await tempmsg.channel.awaitMessages({
              filter: m => m.author.id === message.author?.id,
              max: 1,
              time: 120000,
              errors: ["time"]
            })
              .then(async collected => {
                var msg = collected.first().content.split(" ")[0];
                if (msg) {
                  var thekeyword = {
                    name: msg,
                    output: "ye",
                    embeds: false,
                    channels: [],
                    aliases: []
                  }
                  tempmsg = await message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable8"]))
                      .setColor(es.color)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable9"]))
                      .setFooter(client.getFooter(es))
                    ]
                  })
                  await tempmsg.channel.awaitMessages({
                    filter: m => m.author.id === message.author?.id,
                    max: 1,
                    time: 120000,
                    errors: ["time"]
                  })
                    .then(async collected => {
                      var msg = collected.first().content;
                      if (msg) {
                        thekeyword.output = msg;
                        tempmsg = await message.reply({
                          embeds: [new Discord.MessageEmbed()
                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable10"]))
                            .setColor(es.color)
                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable11"]))
                            .setFooter(client.getFooter(es))
                          ]
                        })
                        await tempmsg.channel.awaitMessages({
                          filter: m => m.author.id === message.author?.id,
                          max: 1,
                          time: 120000,
                          errors: ["time"]
                        })
                          .then(async collected => {
                            var channel = collected.first().mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                            if (channel) {
                              for (const ch of collected.first().mentions.channels.map(this_Code_is_by_LotasDan => this_Code_is_by_LotasDan)) {

                                thekeyword.channels.push(ch.id)
                              }
                              tempmsg = await message.reply({
                                embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable12"]))
                                  .setColor(es.color)
                                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable13"]))
                                  .setFooter(client.getFooter(es))
                                ]
                              })
                              await tempmsg.channel.awaitMessages({
                                filter: m => m.author.id === message.author?.id,
                                max: 1,
                                time: 120000,
                                errors: ["time"]
                              })
                                .then(async collected => {
                                  if (collected.first().content.toLowerCase() == "noalias") {

                                  } else {
                                    var args = collected.first().content.split(" ")
                                    if (args) {
                                      for (const m of args) {
                                        thekeyword.aliases.push(m.toLowerCase())
                                      }
                                    } else {
                                      timeouterror = {
                                        message: "YOU DID NOT SEND ANY ALIAS"
                                      }
                                    }
                                  }
                                  var ttempmsg = await message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable14"]))
                                      .setColor(es.color)
                                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable15"]))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  })
                                  try {
                                    ttempmsg.react("✅")
                                    ttempmsg.react("❌")
                                  } catch {

                                  }
                                  await ttempmsg.awaitReactions({
                                    filter: (reaction, user) => user == originalowner,
                                    max: 1,
                                    time: 90000,
                                    errors: ["time"]
                                  })
                                    .then(async collected => {
                                      var reaction = collected.first();
                                      if (reaction) {
                                        if (reaction.emoji?.name == "✅") {
                                          thekeyword.embed = true;
                                        } else {
                                          thekeyword.embed = false;
                                        }

                                        await client.keyword.push(message.guild.id+".commands", thekeyword)

                                        message.reply({
                                          embeds: [new Discord.MessageEmbed()
                                            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable16"]))
                                            .setColor(es.color)
                                            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable17"]))
                                            .setFooter(client.getFooter(es))
                                          ]
                                        })

                                        if (reaction.emoji?.name == "✅") {
                                          message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                              .setColor(es.color)
                                              .setDescription(thekeyword.output.replace("{member}", `<@${message.author?.id}>`))
                                              .setFooter(client.getFooter(es))
                                            ]
                                          })
                                        } else {
                                          message.reply(thekeyword.output.replace("{member}", `<@${message.author?.id}>`))
                                        }


                                      } else {
                                        return message.reply("you didn't ping a valid Channel")
                                      }
                                    })
                                    .catch(e => {
                                      console.error(e)
                                      return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable18"]))
                                          .setColor(es.wrongcolor)
                                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                          .setFooter(client.getFooter(es))
                                        ]
                                      });
                                    })

                                })
                                .catch(e => {
                                  console.error(e)
                                  return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable19"]))
                                      .setColor(es.wrongcolor)
                                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                      .setFooter(client.getFooter(es))
                                    ]
                                  });
                                })
                            } else {
                              return message.reply({
                                embeds: [new Discord.MessageEmbed()
                                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable20"]))
                                  .setColor(es.wrongcolor)
                                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                  .setFooter(client.getFooter(es))
                                ]
                              });
                            }
                          })
                          .catch(e => {
                            console.error(e)
                            return message.reply({
                              embeds: [new Discord.MessageEmbed()
                                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable20"]))
                                .setColor(es.wrongcolor)
                                .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                                .setFooter(client.getFooter(es))
                              ]
                            });
                          })


                      } else {
                        return message.reply("you didn't ping a valid Channel")
                      }
                    })
                    .catch(e => {
                      console.error(e)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable21"]))
                          .setColor(es.wrongcolor)
                          .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    })


                } else {
                  return message.reply("you didn't ping a valid Channel")
                }
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable22"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });

          } break;
          case "Delete Keyword": {
            let cuc = await client.keyword.get(message.guild.id+ ".commands");
            if (!cuc || cuc.length < 1) return message.reply(":x: There are no Custom Commands")
            let menuoptions = [
            ]
            cuc.forEach((cc, index) => {
              menuoptions.push({
                value: `${cc.name}`.substring(0, 25),
                description: `Delete ${cc.name} ${cc.embed ? "[✅ Embed]" : "[❌ Embed]"}`.substring(0, 50),
                emoji: NumberEmojiIds[index + 1]
              })
            })
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(cuc.length) //OPTIONAL, this is how many values you can have at each selection
              .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
              .setPlaceholder('Select all Custom Commands which should get deleted')
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
              .setAuthor('Custom Command Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/flexed-biceps_1f4aa.png', 'https://discord.gg/U5r2pMuRHG')
              .setDescription(`**Select all \`Custom Commands\` which should get __deleted__**`)
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
                for (const value of menu?.values) {
                  await dbRemove(client.keyword, message.guild.id+".commands", d => String(d.name).substring(0, 25).toLowerCase() == String(value).toLowerCase())
                }
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(`Deleted ${menu?.values.length} Keywords!`)
                    .setDescription(`There are now \`${cuc.length - menu?.values.length} Keywords\` left!`)
                    .setColor(es.color)
                    .setFooter(client.getFooter(es))
                  ]
                });
              }
              else menu?.reply({ content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<:no:998643650378616963> **Selected: \`${collected.first().values.length} Commands\`**` : "❌ **NOTHING SELECTED - CANCELLED**"}` })
            });
          } break;
          case "Show Settings": {
            let cuc = await client.keyword.get(message.guild.id+".commands");
            var embed = new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            var embed2 = new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-customcommand"]["variable22"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            var sendembed2 = false;
            for (let i = 0; i < cuc.length; i++) {
              try {
                var string = `${cuc[i].output}`;
                if (string.length > 250) string = string.substring(0, 250) + " ..."
                if (i > 13) {
                  sendembed2 = true;
                  embed2.addField(`<:arrow:1002960432656568480> \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> " + string)
                } else
                  embed.addField(`<:arrow:1002960432656568480> \`${cuc[i].name}\` | ${cuc[i].embed ? "✅ Embed" : "❌ Embed"}`, ">>> " + string)
              } catch (e) {
                console.error(e)
              }
            }
            if (sendembed2)
              await message.reply({ embeds: [embed, embed2] })
            else
              await message.reply({ embeds: [embed] })
          } break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-keyword"]["variable30"]))
        ]
      });
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