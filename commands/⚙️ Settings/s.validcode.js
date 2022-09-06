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
  name: "s.validcode",
  category: "⚙️ Settings",
  aliases: ["svalidcode", "validcode.s", "validcodes"],
  cooldown: 5,
  usage: "s.validcode  -->  React with the Emoji for the right action",
  description: "This Setup allows you to send logs into a specific Channel, when someone enters a the Command: report",
  memberpermissions: ["ADMINISTRATOR"],
  type: "fun",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

    try {
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Enabled`" : "`❌ Disabled`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `${GuildSettings.validcode ? "Disable" : "Enable"} Valid Code`,
            description: GuildSettings.validcode ? "Don't do anything with Messages containing Code" : "React to messages containing a Valid Code Snippet",
            emoji: GuildSettings.validcode ? "998643650378616963" : "996538231644491907"
          },
          {
            value: "Settings",
            description: `Show the Current Settings of the Valid-Code System`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ticket-Setup!`,
            emoji: "1006298288452026488"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Click me to setup the Valid-Code System!').setCustomId('MenuSelection') 
          .setMaxValues(1).setMinValues(1) 
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
          .setAuthor(client.getAuthor("Valid-Code System Setup", 
          "https://cdn.discordapp.com/emojis/858405056238714930.gif?v=1",
          "https://discord.gg/U5r2pMuRHG"))
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable1"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
          let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable2"]))
          client.disableComponentMessage(menu); used1 = true;
          handle_the_picks(menuoptionindex, menuoptiondata)
        }
        //Event
        client.on('interactionCreate', async (menu) => {
          if (menu?.message.id === menumsg.id) {
            if (menu?.user.id === cmduser.id) {
              if(used1) return menu?.reply({content: `<:no:998643650378616963> You already selected something, this Selection is now disabled!`, ephemeral: true})
              menuselection(menu);
            }
            else menu?.reply({content: `<:no:998643650378616963> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
          }
        });
      }

      //THE FUNCTION TO HANDLE THE SELECTION PICS
      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch(menuoptionindex){
          case 0: {
            await client.settings.set(message.guild.id+`.validcode`, !GuildSettings.validcode)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable3"]))
              .setColor(es.color)
              .setFooter(client.getFooter(es))
            ]});
          }
          case 1: {
            let thesettings = GuildSettings.validcode
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable4"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable5"]))
              .setFooter(client.getFooter(es))
            ]});
          }
        }

      }

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-validcode"]["variable6"]))
      ]});
    }
  },
};