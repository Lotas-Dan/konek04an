const {
  MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js")
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);
const emoji = require(`../../configs/emojis.json`);
const {
  duration, handlemsg
} = require(`../../handlers/functions`)
const dash = `\n❯ Special Thanks: Zrexel#09** 💗`
const version = `\n❯ Version: ${config.konek0Version}`
module.exports = {
  name: "help",
  category: "🔰 Info",
  aliases: ["h", "commandinfo", "halp", "hilfe"],
  usage: "help [Command/Category]",
  description: "Returns all Commmands, or one specific command",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

    let settings = await client.settings.get(message.guild.id);
    try {
      if (args[0]) {
        const embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if (args[0].toLowerCase().includes("cust")) {
          let cuc = await client.customcommands.get(message.guild.id + ".commands");
          if (cuc.length < 1) cuc = [handlemsg(client.la[ls].cmds.info.help.error1)]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc


          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable1"]))
            .setDescription(items.join("︲"))
            .setFooter(client.getFooter(handlemsg(client.la[ls].cmds.info.help.nocustom) + dash, client.user.displayAvatarURL()));

          message.reply({ embeds: [embed] })
          return;
        } var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          return message.reply({ embeds: [embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, { command: args[0].toLowerCase() }))] });
        } else if (cat) {
          var category = cat;
          const items = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable2"]))
            .setFooter(client.getFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, { prefix: prefix }) + dash, client.user.displayAvatarURL()));
          let embeds = await allotherembeds_eachcategory();
          if (cat == "🔰 Info")
            return message.reply({ embeds: [embeds[0]] })
          if (cat == "💸 Economy")
            return message.reply({ embeds: [embeds[1]] })
          if (cat == "🚫 Administration")
            return message.reply({ embeds: [embeds[2]] })
          if (cat == "⚙️ Settings")
            return message.reply({ embeds: [embeds[3]] })
          if (cat == "👑 Owner")
            return message.reply({ embeds: [embeds[4]] })
          if (cat == "⌨️ Programming")
            return message.reply({ embeds: [embeds[5]] })
          if (cat == "📈 Ranking")
            return message.reply({ embeds: [embeds[6]] })
          if (cat == "🕹️ Fun")
            return message.reply({ embeds: [embeds[7]] })
          if (cat == "🎮 MiniGames")
            return message.reply({ embeds: [embeds[8]] })
          if (cat == "😳 Anime-Emotions")
            return message.reply({ embeds: [embeds[9]] })
          if (cat == "🔞 NSFW")
            return message.reply({ embeds: [embeds[10]] })
          if (category.toLowerCase().includes("custom")) {
            const cmd = client.commands.get(items[0].split("`").join("").toLowerCase()) || client.commands.get(client.aliases.get(items[0].split("`").join("").toLowerCase()));
            try {
              embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable3"]));
            } catch { }
          } else {
            embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable4"]))
          }
          return message.reply({ embeds: [embed] })
        }

        if (cmd.name) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.name), `\`\`\`${cmd.name} \`\`\``);
        if (cmd.name) embed.setTitle(handlemsg(client.la[ls].cmds.info.help.detail.about, { cmdname: cmd.name }));
        if (cmd.description) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.desc), `\`\`\`${cmd.description}\`\`\``);
        if (cmd.aliases && cmd.aliases.length > 0 && cmd.aliases[0].length > 1) try {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.aliases), `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        } catch { }
        if (cmd.cooldown) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`${cmd.cooldown} Seconds\`\`\``);
        else embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`3 Seconds\`\`\``);
        if (cmd.usage) {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.usage), `\`\`\`${prefix}${cmd.usage}\`\`\``);
          embed.setFooter(handlemsg(client.la[ls].cmds.info.help.detail.syntax), es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL());
        }
        return message.reply({ embeds: [embed] });
      } else {
        let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("1004028666335985794").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.back))
        let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.home))
        let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('1002960432656568480').setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.forward))
        let menuOptions = [
          {
            label: "Overview",
            value: "Overview",
            emoji: "996538231644491907",
            description: "My Overview of me!"
          },
          {
            label: "Information",
            value: "Information",
            emoji: "🔰",
            description: "Commands to share Information"
          },
          {
            label: "Economy",
            value: "Economy",
            emoji: "💸",
            description: "Commands to use the Economy System"
          },
          {
            label: "Admin",
            value: "Admin",
            emoji: "🚫",
            description: "Commands to Administrate the Server"
          },
          {
            label: "Settings",
            value: "Settings",
            emoji: "⚙️",
            description: "Commands to change Server Settings"
          },
          {
            label: "Owner",
            value: "Owner",
            emoji: "👑",
            description: "Commands to to manage the Bot"
          },
          {
            label: "Programming",
            value: "Programming",
            emoji: "⌨️",
            description: "Commands useful for Programming"
          },
          {
            label: "Ranking",
            value: "Ranking",
            emoji: "📈",
            description: "Commands to mange and show Ranks"
          },
          {
            label: "Fun",
            value: "Fun",
            emoji: "🕹️",
            description: "Commands for Fun (Image) uses"
          },
          {
            label: "Minigames",
            value: "Minigames",
            emoji: "🎮",
            description: "Commands for Minigames with the Bot"
          },
          {
            label: "Anime-Emotions",
            value: "Anime-Emotions",
            emoji: "<:baka:996577257881620531>",
            description: "Commands to show your Emotions with Anime style"
          },
          {
            label: "Nsfw",
            value: "Nsfw",
            emoji: "🔞",
            description: "Commands for Nsfw (underage) Content."
          },
          {
            label: "Custom-Command",
            value: "Customcommand",
            emoji: "🦾",
            description: "Custom Commands of this Server"
          },
        ];
        menuOptions = menuOptions.map(i => {
          if (settings[`${i?.value.toUpperCase()}`] === undefined) {
            return i; //if its not in the db, then add it
          }
          else if (settings[`${i?.value.toUpperCase()}`]) {
            return i; //If its enabled then add it
          }
          else if (settings.showdisabled && settings[`${i?.value.toUpperCase()}`] === false) {
            return i;
          } else {
            //return i // do not return, cause its disabled! to be shown
          }
        })
        const allGuilds = await client.cluster.broadcastEval(c => c.guilds.cache.size).then(r => r.reduce((prev, val) => prev + val, 0))
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Help-Menu-Category-Page")
          //.setMinValues(1)
          //.setMaxValues(5)
          .addOptions(menuOptions.filter(Boolean))
        let buttonRow = new MessageActionRow().addComponents([button_back, button_home, button_forward/*, button_tutorial*/])
        let SelectionRow = new MessageActionRow().addComponents([menuSelection])
        const allbuttons = [buttonRow, SelectionRow]
        //define default embed
        let OverviewEmbed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter("Page Overview | " + client.user.username + dash, client.user.displayAvatarURL()))
          .setTitle(`__${client.user.username}__ information page`)
          .addField(":gear: **__My Features__**",
            `>>> **58+ Systems** <:pepewow:996577782194765825>
            <:application:1016822335573078079> **Applications** and **Ticket** <:ticket:1006965928451391618>
            <:info:1006319522233466950> **User-Info** and **Reaction Role** <:rank:996548968651698246>
            :video_game: **Minigames** and :joystick: **Fun** Commands
            :no_entry_sign: **Administration** and <:mod:1004102429698162911> **Auto-Moderation**
            <:dev:999861387327197284> **slashCommands** are in beta testing.`)
          .addField(":question: **__How do you use me?__**",
            `>>> \`${prefix}settings\` and react with the Emoji for the right action,
            for other systems, use \`s.\` e.g. \`${prefix}s.premium\``)
          .addField(":chart_with_upwards_trend: **__STATS:__**",
            `>>> :gear: **${client.commands.map(a => a).length} Commands**
            :file_folder: **${client.categories.map(e => e).length} Categories**
            ⌚️ **${duration(client.uptime).map(i => `\`${i}\``).join("︲")} Uptime**
            📶 **\`${Math.floor(client.ws.ping)}ms\` Ping**
            <:database:1011755783362465932> **\`${Math.floor(await client.database.ping())}ms\` DB-Ping**`)
          /*<:official:1002966571985154078>  Made by [**Konek0 Official**](https://discord.gg/U5r2pMuRHG)`)*/
          .addField(":moneybag: Want to Support us?", `>>> **\` 1. Way \`** *Donate [Patreon](https://www.patreon.com/lotasdan?fan_landing=true), [Ko-Fi](https://ko-fi.com/lotasdan), [Buy Me A Coffee](https://www.buymeacoffee.com/lotasdan228)*\n**\` 2. Way \`** *Connect to the [Official](https://discord.gg/U5r2pMuRHG) server*\n**\` 3. Way \`** *Recommend the bot to others 🤗*`)

        let err = false;
        //Send message with buttons
        let helpmsg = await message.reply({
          content: `***Click on the __Buttons__ to swap the Help-Pages***`,
          embeds: [OverviewEmbed],
          components: allbuttons
        }).catch(e => {
          err = true;
          return message.reply(`:x: I couldn't send help? Maybe I am missing the Permission to **EMBED LINKS**`).catch(() => null)
        });
        if (err) return;
        var edited = false;
        var embeds = [OverviewEmbed]
        const otherEmbeds = await allotherembeds_eachcategory(true);
        for await (const e of otherEmbeds)
          embeds.push(e)
        let currentPage = 0;

        //create a collector for the thinggy
        const collector = helpmsg.createMessageComponentCollector({ filter: (i) => (i?.isButton() || i?.isSelectMenu()) && i?.user && i?.message.author?.id == client.user.id, time: 180e3 });
        //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
        collector.on('collect', async b => {
          try {
            if (b?.isButton()) {
              if (b?.user.id !== message.author?.id)
                return b?.reply({ content: handlemsg(client.la[ls].cmds.info.help.buttonerror, { prefix: prefix }), ephemeral: true });

              //page forward
              if (b?.customId == "1") {
                //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
                if (currentPage !== 0) {
                  currentPage -= 1
                } else {
                  currentPage = embeds.length - 1
                }
              }
              //go home
              else if (b?.customId == "2") {
                //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
                currentPage = 0;
              }
              //go forward
              else if (b?.customId == "3") {
                //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
                if (currentPage < embeds.length - 1) {
                  currentPage++;
                } else {
                  currentPage = 0
                }
              }
              await helpmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons }).catch(e => { })
              b?.deferUpdate().catch(e => { })


            }
            if (b?.isSelectMenu()) {
              //b?.reply(`***Going to the ${b?.customId.replace("button_cat_", "")} Page***, *please wait 2 Seconds for the next Input*`, true)
              //information, music, admin, settings, voice, minigames, nsfw
              let index = 0;
              let vembeds = []
              const otherEmbeds = await allotherembeds_eachcategory();
              let theembeds = [OverviewEmbed, ...otherEmbeds];
              for await (const value of b?.values) {
                switch (value.toLowerCase()) {
                  case "overview": index = 0; break;
                  case "information": index = 1; break;
                  case "economy": index = 2; break;
                  case "admin": index = 3; break;
                  case "settings": index = 4; break;
                  case "owner": index = 5; break;
                  case "programming": index = 6; break;
                  case "ranking": index = 7; break;
                  case "fun": index = 8; break;
                  case "minigames": index = 9; break;
                  case "anime-emotions": index = 10; break;
                  case "nsfw": index = 11; break;
                  case "customcommand": index = 12; break;
                }
                vembeds.push(theembeds[index])
              }
              b?.reply({
                embeds: vembeds,
                ephemeral: true
              });
            }
          } catch (e) {
            console.error(e)
            console.log(String(e).italic.italic.grey.dim)
          }
        });

        collector.on('end', collected => {
          //array of all disabled buttons
          let d_buttonRow = new MessageActionRow().addComponents([button_back.setDisabled(true), button_home.setDisabled(true), button_forward.setDisabled(true)/*, button_tutorial*/])
          const alldisabledbuttons = [d_buttonRow]
          if (!edited) {
            edited = true;
            helpmsg.edit({ content: handlemsg(client.la[ls].cmds.info.help.timeended, { prefix: prefix }), embeds: [helpmsg.embeds[0]], components: alldisabledbuttons }).catch((e) => { })
          }
        });
      }
      async function allotherembeds_eachcategory(filterdisabled = false) {
        //ARRAY OF EMBEDS
        var embeds = [];

        //INFORMATION COMMANDS
        var embed0 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔰 Info").size}\`] 🔰 Information Commands 🔰`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔰 Info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField(`🙂 **User Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "user").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`<:Discord:996539552011395142> **Server Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "server").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`<:Bot_Flag:996539549910044764> **Bot Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "bot").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`<:Builder:996538230272958524> **Util Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "util").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed0)

        //ECONOMY COMMANDS
        var embed1 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💸 Economy").size}\`] 💸 Economy Commands 💸 | ${settings.ECONOMY ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💸 Economy").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField(`🕹️ **Mini Game to earn 💸**`, ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "game").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`:clock1: **Repeatingly earn 💸 via Event(s)**`, ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "earn").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField(`<:Builder:996538230272958524> **Information & Manage 💸**`, ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        if (!filterdisabled || settings.ECONOMY || settings.showdisabled) embeds.push(embed1)

        //ADMINISTRATION
        var embed4 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🚫 Administration").size}\`] 🚫 Admin Commands 🚫`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🚫 Administration").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("<:Discord:996539552011395142> **Server Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("server")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("<:Channel:996540398031880214> **Channel Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("channel")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("<:Roles:996540401144049664> **Role Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("role")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("👤 **Member Related Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("member")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed4)

        //Settings
        var embed5 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").size}\`] ⚙️ Settings Commands ⚙️`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("😛 **Setups for Entertainment**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("fun")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("💡 **Information & Manage (Bot/Server) Settings**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("info")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("<:hattip:996577157230903340> **Most used Systems**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("system")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("<:Builder:996538230272958524> **Security Systems**", "> " + client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("security")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed5)

        //Owner
        var embed7 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👑 Owner").size}\`] 👑 Owner Commands 👑`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👑 Owner").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("<:Discord:996539552011395142> **Information & Manage**", "> " + client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("info")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("<:Bot_Flag:996539549910044764> **Adjust the Bot**", "> " + client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("bot")).sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        embeds.push(embed7)

        //Programming Commands
        var embed8 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").size}\`] ⌨️ Programming Commands ⌨️ | ${settings.PROGRAMMING ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.PROGRAMMING || settings.showdisabled) embeds.push(embed8)

        //Ranking
        var embed9 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "📈 Ranking").size}\`] 📈 Ranking Commands 📈 | ${settings.RANKING ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "📈 Ranking").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("<:Builder:996538230272958524> **Manage Rank**", `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "manage").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          .addField("📈 **Rank Information**", `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "info").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
        var temp = new MessageEmbed()
          .setColor(es.color)
          .setTitle('We are sorry')
          .setDescription('The "Ranking" command does not work yet.')
          if (!filterdisabled || settings.RANKING || settings.showdisabled) embeds.push(temp)

        //FUN COMMANDS
        var embed11 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").size}\`] 🕹️ Fun Commands 🕹️ | ${settings.FUN ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("🙂 **Fun User Image Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "user").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("💬 **Fun Text Commands**", "> " + client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "text").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
        if (!filterdisabled || settings.FUN || settings.showdisabled) embeds.push(embed11)

        //MINIGAMES
        var embed12 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").size}\`] 🎮 Mini Games Commands 🎮 | ${settings.MINIGAMES ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("💬 **Text Based Minigames**", "> " + client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "text").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .addField("🔘 **Button(s) Minigames**", "> " + client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "buttons").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲"))
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
        if (!filterdisabled || settings.MINIGAMES || settings.showdisabled) embeds.push(embed12)

        //ANIME EMOTIONS
        var embed13 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").size}\`] <:baka:996577257881620531> Anime Commands <:baka:996577257881620531> | ${settings.ANIME ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("<:baka:996577257881620531> **Anime-Mention-Emotions (or Self.)**", `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "mention").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          .addField("<:baka:996577257881620531> **Anime-Self-Emotions**", `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "self").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
        if (!filterdisabled || settings.ANIME || settings.showdisabled) embeds.push(embed13)

        //NSFW COMMANDS
        var embed14 = new MessageEmbed()
          .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔞 NSFW").size}\`] 🔞 NSFW Commands 🔞 | ${settings.NSFW ? "<a:yes:996538231644491907> ENABLED" : "<:no:998643650378616963> DISABLED"}`)
          .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔞 NSFW").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}*`)
          .addField("\u200b", "__**Sub-Categorized Commands:**__")
          .addField("🔞 **Animated (Hentai, Neko, SFW, ...)**", `> ${client.commands.filter((cmd) => cmd.category === "🔞 NSFW" && cmd.type === "anime").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
          .addField("🔞 **Reallife (Porn, Erotik, etc.)**", `> ${client.commands.filter((cmd) => cmd.category === "🔞 NSFW" && cmd.type === "real").sort((a, b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join("︲")}`)
        if (!filterdisabled || settings.NSFW || settings.showdisabled) embeds.push(embed14)

        //CUSTOM COMMANDS EMBED
        var embed15 = new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable23"]))
        let cuc = await client.customcommands.get(message.guild.id + ".commands");
        console.log(cuc)
        if (!cuc || cuc.length < 1) cuc = ["NO CUSTOM COMMANDS DEFINED YET, do it with: `!s.customcommands`"]
        else cuc = cuc.map(cmd => `\`${cmd.name}\``)
        const items = cuc
        embed15.setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable24"]))
        embed15.setDescription(">>> " + items.join("︲"))
        embeds.push(embed15)

        return embeds.map((embed, index) => {
          return embed
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\nTo see command Descriptions and Information, type: ${config.prefix}help [CMD NAME]` + version, client.user.displayAvatarURL()));
        })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
        ]
      });
    }
  }
}
