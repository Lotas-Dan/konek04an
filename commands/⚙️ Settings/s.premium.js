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
    name: "s.premium",
    category: "⚙️ Settings",
    aliases: ["spremium", "premium.s"],
    cooldown: 5,
    usage: "s.apremium  -->  React with the Emoji for the right action",
    description: "This Setup allows you to buy premium for your server",
    memberpermissions: ["ADMINISTRATOR"],
    type: "system",
    run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

        try {
            first_layer()
            async function first_layer() {
                let menuoptions = [
                    {
                        value: "Buy Premium",
                        description: `Buying premium for your server`,
                        emoji: "1004118485573570580"
                    },
                    {
                        value: "Show Settings",
                        description: `Show Settings of the Preium`,
                        emoji: "📑"
                    },
                    {
                        value: "Cancel",
                        description: `Cancel and stop the Premium!`,
                        emoji: "1006298288452026488"
                    }
                ]
                //define the selection
                let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder('Click me to setup the Premium System!')
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
                    .setAuthor(client.getAuthor('Premium Setup', 'https://cdn.discordapp.com/emojis/1014915518433591376.gif', 'https://discord.gg/U5r2pMuRHG'))
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
                switch(optionhandletype){
                    case 'Buy Premium' : {
                        message.reply({embeds: [new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-premium"]["buyPremiumTitle"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-premium"]["buyPremiumDesc"]))]})
                    }break;
                    case 'Show Settings' : {
                        let premium = await client.premium.get(message.guild.id, {
                            data: []
                        })
                        const {enabled, expireAt, peramanent} = premium
                        return message.reply({embeds: [new MessageEmbed()
                        .setColor(es.color)
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-premium"]["title"]))
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-premium"]["description"]))]})
                    }break;
                }
            }
        } catch (e){ 
            console.log(e)
        }
    }
}