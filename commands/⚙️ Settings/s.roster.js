var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure, dbRemove,
  edit_Roster_msg,
  send_roster_msg,
} = require(`../../handlers/functions`);
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "s.roster",
  category: "⚙️ Settings",
  aliases: ["sroster", "roster.s", "rosters"],
  cooldown: 5,
  usage: "s.roster --> React with the Emoji for the right action",
  description: "Manage 25 different Roster Systems",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    let pre, rostercount = 0;
    const filter = (reaction, user) => {
      return user.id == cmduser.id
    }
    try {
      const obj = {};
      for (let i = 1; i <= 100; i++) {
          obj[`roster${i}`] = {
            rosterchannel: "notvalid",
            rosteremoji: "➤",
            rostermessage: "",
            rostertitle: "Roster",
            rosterstyle: "1",
            rosterroles: [],
            inline: false,
          }
      }
      await dbEnsure(client.roster, message.guild.id, obj);

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      var thedb = client.roster;
      async function first_layer(){
        
        let menuoptions = [ ]
        for (let i = 1; i <= 100; i++){
          menuoptions.push({
            value: `${i} Roster System`,
            description: `Manage/Edit the ${i}. Server Roster System`,
            emoji: NumberEmojiIds[i]
          })
        }
        
        
        let row1 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Roster System!')
          .addOptions(
            menuoptions.slice(0, 25).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row2 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection2')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Roster System!')
          .addOptions(
            menuoptions.slice(25, 50).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row3 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection3')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Roster System!')
          .addOptions(
            menuoptions.slice(50, 75).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        let row4 = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('MenuSelection4')
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Roster System!')
          .addOptions(
            menuoptions.slice(75, 100).map(option => {
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            })
          )
        )
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor(client.getAuthor('Server Roster Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/page-with-curl_1f4c3.png', 'https://discord.gg/U5r2pMuRHG'))
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [row1, row2, row3, row4]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          client.disableComponentMessage(menu);
          let SetupNumber = menu?.values[0].split(" ")[0]
          pre = `roster${SetupNumber}`;
          rostercount = SetupNumber;
          used1 = true;
          second_layer(SetupNumber, menuoptiondata)
        }
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
            menuselection(menu)
          }
          else menu?.reply({content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:996538231644491907> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function second_layer(SetupNumber, menuoptiondata){
        let menuoptions = [
          {
            value: "Define Channel",
            description: `Define the Channel for this Roster System`,
            emoji: "996540398031880214"
          },
          {
            value: "Add Roster Role",
            description: `Add a Roster Role to the bottom to get displayed`,
            emoji: "1004118485573570580"
          },
          {
            value: "Remove Roster Role",
            description: `Removed a displayed Roster Role of the List`,
            emoji: "❌"
          },
          {
            value: "Show Roster Roles",
            description: `Show all Roster Roles of this Roster`,
            emoji: "📃"
          },
          {
            value: "Edit Roster Style",
            description: `Adjust the Display Style of this Roster`,
            emoji: "🛠"
          },
          {
            value: "Edit Emoji",
            description: `Edit the Emoji/Text infront of the Names`,
            emoji: "✏️"
          },
          {
            value: "Set Title",
            description: `Set the Embed Title of that Roster`,
            emoji: "🗞"
          },
          {
            value: `${await thedb?.get(`${message.guild.id}.${pre}.inline`) ? "Disable Multiple Rows": "Enable Roster Rows"}`,
            description: `${await thedb?.get(`${message.guild.id}.${pre}.inline`) ? "Disable that i inline all Fields": "Enable that i inline all Fields"}`,
            emoji: "📰"
          },
          {
            value: `${await thedb?.get(`${message.guild.id}.${pre}.showallroles`) ? "Cut Members off" : "Show all members"}`,
            description: `${await thedb?.get(`${message.guild.id}.${pre}.showallroles`) ? "Cut Members off and show the rest amount": "Don't cut Off, show all of them"}`,
            emoji: "📰"
          },

          {
            value: "Delete & Reset",
            description: `Delete current setup, which allows you to resetup`,
            emoji: "☠️"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ticket-Setup!`,
            emoji: "1006298288452026488"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder(`Click me to manage the ${SetupNumber} Roster System!\n\n**You've picked:**\n> ${menuoptiondata.value}`)
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
          .setAuthor(SetupNumber + " Server Roster Setup", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/facebook/65/page-with-curl_1f4c3.png", "https://discord.gg/U5r2pMuRHG")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable4"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable5"]))
          client.disableComponentMessage(menu);
          handle_the_picks(menu?.values[0], SetupNumber)
        }
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
            menuselection(menu)
          } else menu?.reply({
            content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `${collected && collected.first() && collected.first().values ? `<a:yes:996538231644491907> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`
          })
        });
      }

      async function handle_the_picks(optionhandletype, SetupNumber, ticket) {

        switch (optionhandletype) {
          case "Define Channel":{

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable7"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable8"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
                if (channel) {
                  try {
                    await thedb?.set(`${message.guild.id}.${pre}.rosterchannel`, channel.id)
                    send_roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable9"]))
                        .setColor(es.color)
                        .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\``.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable10"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable20"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "you didn't ping a valid Channel")
                }
              })
              .catch(e => {
                console.error(e)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable12"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
              })
          }break;
          case "Add Roster Role":{
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable13"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable14"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (role) {
                  var rosteroles = await thedb?.get(`${message.guild.id}.${pre}.rosterroles`)
                  if (rosteroles.includes(role.id)) return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable15"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable16"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                  try {
                    await thedb?.push(`${message.guild.id}.${pre}.rosterroles`, role.id)
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable17"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable18"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable19"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable29"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "you didn't ping a valid Role")
                }
              })
              .catch(e => {
                console.error(e)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable21"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
    
              })    
          }break;
          case "Remove Roster Role":{

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable22"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable23"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var message = collected.first();
                var role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
                if (role) {
                  var rosteroles = await thedb?.get(`${message.guild.id}.${pre}.rosterroles`)
                  if (!rosteroles.includes(role.id)) return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable24"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable25"]))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                  try {
                    await dbRemove(thedb, `${message.guild.id}.${pre}.rosterroles`, role.id)
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable26"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable27"]))
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable28"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable49"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "you didn't ping a valid Role")
                }
              })
              .catch(e => {
                console.error(e)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable30"]))
                      .setColor(es.wrongcolor)
                      .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
              })
          }break;
          case "Show Roster Roles":{
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable31"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable32"]))
                .setFooter(client.getFooter(es))
              ]
            })
          }break;
          case "Edit Roster Style":{
            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable33"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable34"])).setFooter(client.getFooter(es))
              ]
            })
            try{
              for await (const emoji of ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"])
               tempmsg.react(emoji)
            }catch(e){
              console.error(e)
            }
            await tempmsg.awaitReactions({
                filter,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var reaction = collected.first()
                reaction.users.remove(message.author?.id)
                if (reaction.emoji?.name === "1️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, "1")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable35"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "2️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, "2")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable36"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "3️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, "3")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable37"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "4️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, "4")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable38"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "5️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, "5")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable39"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "6️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, "6")
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable40"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else if (reaction.emoji?.name === "7️⃣") {
                  await thedb?.set(`${message.guild.id}.${pre}.rosterstyle`, 7)
                  edit_Roster_msg(client, message.guild, thedb, pre)
                  return message.reply({
                    embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable41"]))
                      .setColor(es.color)
                      .setDescription(`The Roster will edit soon!\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2000))
                      .setFooter(client.getFooter(es))
                    ]
                  });
                } else return message.reply( "You reacted with a wrong emoji")
    
              })
              .catch(e => {
                timeouterror = e;
              })
            if (timeouterror)
              return message.reply({
                embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable42"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                  .setFooter(client.getFooter(es))
                ]
              });
          }break;
          case "Edit Emoji":{


            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable43"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable44"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var msg = collected.first().content;
    
                if (msg) {
                  if (msg.toLowerCase() == "noemoji") {
                    await thedb?.set(`${message.guild.id}.${pre}.rosteremoji`)
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable45"]))
                        .setColor(es.color)
                        .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\`\n\nExample: \n<@${message.author?.id}> | \`${message.author.tag}\`\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                    return;
                  }
                  try {
                    if (msg.includes(":")) {
                      await thedb?.set(`${message.guild.id}.${pre}.rosteremoji`, msg)
                      edit_Roster_msg(client, message.guild, thedb, pre)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable46"]))
                          .setColor(es.color)
                          .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\`\n\nExample: \n${msg} <@${message.author?.id}> | \`${message.author.tag}\`\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    } else {
                      await thedb?.set(`${message.guild.id}.${pre}.rosteremoji`, msg.substring(0, 5))
                      edit_Roster_msg(client, message.guild, thedb, pre)
                      return message.reply({
                        embeds: [new Discord.MessageEmbed()
                          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable47"]))
                          .setColor(es.color)
                          .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\`\n\nExample: \n${msg.substring(0, 5)} <@${message.author?.id}> | \`${message.author.tag}\`\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2048))
                          .setFooter(client.getFooter(es))
                        ]
                      });
                    }
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable48"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable55"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "you didn't add a valid message")
                }
              })
              .catch(e => {
                console.error(e)
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable50"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
          }break;
          case "Set Title":{

            var tempmsg = await message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable51"]))
                .setColor(es.color)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable52"]))
                .setFooter(client.getFooter(es))
              ]
            })
            await tempmsg.channel.awaitMessages({
                filter: m => m.author.id === message.author?.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(async collected => {
                var msg = collected.first().content;
    
                if (msg) {
                  try {
                    await thedb?.set(`${message.guild.id}.${pre}.rostertitle`, msg.substring(0, 256))
                    edit_Roster_msg(client, message.guild, thedb, pre)
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable53"]))
                        .setColor(es.color)
                        .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\`\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2048))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  } catch (e) {
                    return message.reply({
                      embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable54"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable61"]))
                        .setFooter(client.getFooter(es))
                      ]
                    });
                  }
                } else {
                  return message.reply( "you didn't add a valid message")
                }
              })
              .catch(e => {
                console.error(e)
                return message.reply({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable56"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]
                });
              })
          }break;
          case `${await thedb?.get(`${message.guild.id}.${pre}.inline`) ? "Disable Multiple Rows": "Enable Roster Rows"}`:{
            await thedb?.set(`${message.guild.id}.${pre}.inline`, !await thedb?.get(`${message.guild.id}.${pre}.inline`))
            edit_Roster_msg(client, message.guild, thedb, pre)    
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable57"]))
                .setColor(es.color)
                .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\`\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          }break;
          case `${await thedb?.get(`${message.guild.id}.${pre}.showallroles`) ? "Cut Members off" : "Show all members"}`:{
            await thedb?.set(`${message.guild.id}.${pre}.showallroles`, !await thedb?.get(`${message.guild.id}.${pre}.showallroles`))
            edit_Roster_msg(client, message.guild, thedb, pre)    
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable58"]))
                .setColor(es.color)
                .setDescription(`To add Roles to the Roster type: \`${prefix}setup-roster\`\n\nIt will update in less then **5 Minutes**, *If it did not update yet*`.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          }break;
          case `Delete & Reset`:{
            await thedb?.set(`${message.guild.id}.${pre}`, {
              rosterchannel: "notvalid",
              rosteremoji: "➤",
              showallroles: false,
              rostermessage: "",
              rostertitle: "Roster",
              rosterstyle: "1",
              rosterroles: [],
              inline: false,
            })
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-roster"]["variable59"]))
                .setColor(es.color)
                .setDescription(`Re-set-it-up with: \`${prefix}setup-roster\``.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]
            });
          }break;
        }
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
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