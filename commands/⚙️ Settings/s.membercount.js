var {
  MessageEmbed, MessageSelectMenu, MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
var emoji = require(`../../configs/emojis.json`);
var {
  dbEnsure
} = require(`../../handlers/functions`);
module.exports = {
  name: "s.membercount",
  category: "⚙️ Settings",
  aliases: ["smembercount", "membercount.s", "membercounts", "smembercounter"],
  cooldown: 5,
  usage: "s.membercount  -->  React with the Emoji for the right action",
  description: "This Setup allows you to specify a Channel which Name should be renamed every 10 Minutes to a Member Counter of Bots, Users, or Members",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
    
    //ensure the database
    let ensureobject = { }
    for (let i = 1; i <= 25; i++){
      ensureobject[`channel${i}`] = "no";
      ensureobject[`message${i}`] = "🗣 Members: {member}";
    }
    await dbEnsure(client.setups, message.guild.id+".membercount", ensureobject);
    try {

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        
        let menuoptions = [ ]
        for (let i = 1; i <= 25; i++){
          menuoptions.push({
            value: `${i} Member Counter`,
            description: `Manage/Edit the ${i}. Member Counter`,
            emoji: NumberEmojiIds[i]
          })
        }
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Member Counter!') 
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
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor('Member Counter Setup', 'https://cdn.discordapp.com/emojis/891040423605321778.png?size=96', 'https://discord.gg/U5r2pMuRHG')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          client.disableComponentMessage(menu);
          let SetupNumber = menu?.values[0].split(" ")[0]
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
        
        var tempmsg = await message.reply ({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable6"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable7"])).setFooter(client.getFooter(es))]
          })
          await tempmsg.channel.awaitMessages({filter: m => m.author.id == cmduser.id, 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var message = collected.first();
            if(!message) return message.reply( "NO MESSAGE SENT")
            let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content);
            if(channel){
              var settts = await client.setups.get(`${message.guild.id}.membercount`);
              let name = await client.setups.get(`${message.guild.id}.membercount.message${SetupNumber}`, channel.id)
              let curmessage = name || channel.name;
              await client.setups.set(`${message.guild.id}.membercount.channel${SetupNumber}`, channel.id)
              let temptype = SetupNumber;
              message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable8"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(`Current Name: \`${curmessage}\``.substring(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
              
  
              tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable9"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(`Current Name: \`${curmessage}\`

*Send the Name NOW!, mind that the Name must be shorter then 32 Characters!!!*`)
.addField(`**USER KEYWORDS** (USERS __including__ Bots):`, `> \`{user}\` / \`{users}\` will be replaced with the amount of all users, no matter if bot or not

> \`{online}\` will be replaced with the amount of **ONLINE** USERS  
> \`{idle}\` will be replaced with the amount of **IDLE** USERS  
> \`{dnd}\` will be replaced with the amount of **DND** USERS 
> \`{offline}\` will be replaced with the amount of **OFFLINE** USERS 
> \`{allonline}\` will be replaced with the amount of **ONLINE**+**IDLE**+**DND** USERS  `)
.addField(`**MEMBER KEYWORDS** (Members __without__ Bots):`, `> \`{member}\` / \`{members}\` will be replaced with the amount of all Members (Humans)

> \`{onlinemember}\` will be replaced with the amount of **ONLINE** MEMBERS  
> \`{idlemember}\` will be replaced with the amount of **IDLE** MEMBERS  
> \`{dndmember}\` will be replaced with the amount of **DND** MEMBERS 
> \`{offlinemember}\` will be replaced with the amount of **OFFLINE** MEMBERS 
> \`{allonlinemember}\` will be replaced with the amount of **ONLINE**+**IDLE**+**DND** MEMBERS (no Bots)  `)
.addField(`**OTHER KEYWORDS:**`, `> \`{bot}\` / \`{bots}\` will be replaced with the amount of all bots
> \`{channel}\` / \`{channels}\` will be replaced with the amount of all Channels
> \`{text}\` / \`{texts}\` will be replaced with the amount of Text Channels
> \`{voice}\` / \`{voices}\` will be replaced with the amount of Voice Channels
> \`{stage}\` / \`{stages}\` will be replaced with the amount of Stage Channels
> \`{thread}\` / \`{threads}\` will be replaced with the amount of Threads
> \`{news}\` will be replaced with the amount of News Channels
> \`{category}\` / \`{parent}\` will be replaced with the amount of Categories / Parents
> \`{openthread}\` / \`{openthreads}\` will be replaced with the amount of open Threads
> \`{archivedthread}\` / \`{archivedthreads}\` will be replaced with the amount of archived Threads

> \`{role}\` / \`{roles}\` will be replaced with the amount of Roles`)
.addField(`**Examples:**`, `> \`🗣 Members: {members}\`
> \`🗣 Roles: {roles}\`
> \`🗣 Channels: {channels}\`
> \`🗣 Bots: {bots} \`
> \`🗣 All Users: {users}\``)
.setFooter(client.getFooter(es))]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == cmduser.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var message = collected.first();
                  if(!message) throw "NO MESSAGE SENT";
                  let name = message.content;
                  if(name && name.length <= 32){
                    let guild = message.guild;
                    await client.setups.set(`${message.guild.id}.membercount.message${SetupNumber}`, name, )
                    channel.setName(String(name)
            
                    .replace(/{user}/i, guild.memberCount)
                    .replace(/{users}/i,  guild.memberCount)
          
                    .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
                    .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)
          
                    .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
                    .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)
          
                    .replace(/{online}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
                    .replace(/{offline}/i, guild.members.cache.filter(member => !!member.user.bot && member.presence).size)
                    .replace(/{idle}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "idle").size)
                    .replace(/{dnd}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
                    .replace(/{allonline}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)
          
                    .replace(/{onlinemember}/i, guild.members.cache.filter(member => member.user.bot && member.presence && member.presence.status == "online").size)
                    .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.presence).size)
                    .replace(/{idlemember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
                    .replace(/{dndmember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
                    .replace(/{allonlinemember}/i, guild.members.cache.filter(member => member.presence).size)
          
                    .replace(/{role}/i, guild.roles.cache.size)
                    .replace(/{roles}/i, guild.roles.cache.size)
          
                    .replace(/{channel}/i, guild.channels.cache.size)
                    .replace(/{channels}/i, guild.channels.cache.size)
          
                    .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                    .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                    .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                    .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                    .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
                    .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                    .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                    .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
          
                    .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                    .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                    .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                    .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                    .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                    .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                    .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
                    )
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable10"]))
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setDescription(`Example: \`${String(name)
            
                        .replace(/{user}/i, guild.memberCount)
                        .replace(/{users}/i,  guild.memberCount)
              
                        .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
                        .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)
              
                        .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
                        .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)
              
                        .replace(/{online}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
                        .replace(/{offline}/i, guild.members.cache.filter(member => !!member.user.bot && member.presence).size)
                        .replace(/{idle}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "idle").size)
                        .replace(/{dnd}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
                        .replace(/{allonline}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)
              
                        .replace(/{onlinemember}/i, guild.members.cache.filter(member => member.user.bot && member.presence && member.presence.status == "online").size)
                        .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.presence).size)
                        .replace(/{idlemember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
                        .replace(/{dndmember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
                        .replace(/{allonlinemember}/i, guild.members.cache.filter(member => member.presence).size)
              
                        .replace(/{role}/i, guild.roles.cache.size)
                        .replace(/{roles}/i, guild.roles.cache.size)
              
                        .replace(/{channel}/i, guild.channels.cache.size)
                        .replace(/{channels}/i, guild.channels.cache.size)
              
                        .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                        .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                        .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                        .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                        .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
                        .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                        .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                        .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
              
                        .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                        .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                        .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                        .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                        .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                        .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                        .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)}\`
                        
**Checking all Channels every 60 Minutes:**
> **Delay between each channel:** \`5.1 Minutes\` (Only if a Change is needed)
> **Optimal Member-Count Channels:** \`6 or less\``.substring(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else{
                    message.reply( "No Name added, or the Name is too long!")
                  }
                })
                .catch(e => {
                  console.log(String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substring(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
            }
            else{
              message.reply("NO CHANNEL PINGED / NO ID ADDED");
            }
          })
          .catch(e => {
            console.error(e)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable12"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substring(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substring(0, 2000)}\`\`\``)
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
    /*"<:Number_0:843943149915078696>",
    "<:Number_1:843943149902626846>",
    "<:Number_2:843943149868023808>",
    "<:Number_3:843943149914554388>",
    "<:Number_4:843943149919535154>",
    "<:Number_5:843943149759889439>",
    "<:Number_6:843943150468857876>",
    "<:Number_7:843943150179713024>",
    "<:Number_8:843943150360068137>",
    "<:Number_9:843943150443036672>",
    "<:Number_10:843943150594031626>",
    "<:Number_11:893173642022748230>",
    "<:Number_12:893173642165383218>",
    "<:Number_13:893173642274410496>",
    "<:Number_14:893173642198921296>",
    "<:Number_15:893173642182139914>",
    "<:Number_16:893173642530271342>",
    "<:Number_17:893173642538647612>",
    "<:Number_18:893173642307977258>",
    "<:Number_19:893173642588991488>",
    "<:Number_20:893173642307977266>",
    "<:Number_21:893173642274430977>",
    "<:Number_22:893173642702250045>",
    "<:Number_23:893173642454773782>",
    "<:Number_24:893173642744201226>",
    "<:Number_25:893173642727424020>"*/
  ]
}