const config = require(`${process.cwd()}/configs/config.json`); //loading config file with token and prefix, and settings
const ee = require(`${process.cwd()}/configs/embed.json`); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api
const {
    MessageEmbed
} = require("discord.js"); //this is the official discord.js wrapper for the Discord Api
const {
    escapeRegex,
    delay,
    simple_databasing,
    databasing,
    handlemsg, clearDBData,
    CheckGuild
} = require(`../../handlers/functions`); //Loading all needed functions
//here the event starts
module.exports = async (client, message) => {
    try {
        //if the message is not in a guild (aka in dms), return aka ignore the inputs
        if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return
        //if the channel is on partial fetch it
        if (message.channel?.partial) await message.channel.fetch().catch(() => { });
        if (message.member?.partial) await message.member.fetch().catch(() => { });
        //ensure all databases for this server/user from the databasing function
        if (client.checking[message.guild.id]) {
            if (message.content.includes(client.user.id) || message.content.startsWith(config.prefix)) {
                return message.reply(":x: I'm setting myself up for this Guild!")
            }
            return
        }

        if (!Object.keys(client.checking).includes(message.guild.id)) await CheckGuild(client, message.guild.id);

        var not_allowed = false;
        const guild_settings = await client.settings.get(message.guild.id);
        const guild_setups = await client.setups.get(message.guild.id);
        let messageCreateHandlers = [
            "aichat", "anticaps", "antidiscord", "antilinks", "antimention", "antiselfbot", "antispam", "autoembed",
            "blacklist", "counter", "ghost_ping_detector", "keyword", "suggest", "validcode"
        ]
        messageCreateHandlers.forEach(handler => {
            try {
                require(`../../handlers/${handler}`).messageCreate(client, message, guild_settings, guild_setups)
            } catch (e) {
                console.error(e)
            }
        })

        let { prefix, botchannel, unkowncmdmessage, language: ls, embed: es } = guild_settings;
        // if the message  author is a bot, return aka ignore the inputs
        if (message.author?.bot) return
        //if not in the database for some reason use the default prefix
        if (prefix === null) prefix = config.prefix;
        //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        //if its not that then return
        if (!prefixRegex.test(message.content)) return
        //now define the right prefix either ping or not ping
        const [, matchedPrefix] = message.content.match(prefixRegex);
        //CHECK PERMISSIONS
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
            return message.reply(`:x: **I am missing the Permission to USE EXTERNAL EMOJIS**`).catch(console.error)
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.EMBED_LINKS))
            return message.reply(`<:no:998643650378616963> **I am missing the Permission to EMBED LINKS (Sending Embeds)**`).catch(console.error)
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.ADD_REACTIONS))
            return message.reply(`<:no:998643650378616963> **I am missing the Permission to ADD REACTIONS**`).catch(console.error)


        //CHECK IF IN A BOT CHANNEL OR NOT
        if (botchannel && botchannel.toString() !== "") {
            //if its not in a BotChannel, and user not an ADMINISTRATOR
            if (!botchannel.includes(message.channel.id) && !message.member?.permissions?.has("ADMINISTRATOR")) {
                for (const channelId of botchannel) {
                    let channel = message.guild.channels.cache.get(channelId);
                    if (!channel && channelId) {
                        dbRemove(client.settings, `${message.guild.id}.botchannel`, channelId)
                    }
                }
                try {
                    message.react("998643650378616963").catch(console.error)
                } catch { }
                not_allowed = true;
                return message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.botchat.title)
                        .setDescription(`${client.la[ls].common.botchat.description}\n> ${botchannel.map(c => `<#${c}>`).join(", ")}`)]
                }
                ).then(async msg => {
                    setTimeout(() => {
                        try {
                            msg.delete().catch(console.error)
                        } catch { }
                    }, 5000)
                }).catch(console.error)
            }
        }
        //create the arguments with sliceing of of the rightprefix length
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        //creating the cmd argument by shifting the args by 1
        const cmd = args.shift()?.toLowerCase();
        //if no cmd added return error
        if (cmd.length === 0) {
            return
            if (matchedPrefix.includes(client.user.id))
                return message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(es.color)
                        .setTitle(handlemsg(client.la[ls].common.ping, { prefix: prefix }))]
                }).catch(console.error);
        }
        //get the command from the collection
        let command = client.commands.get(cmd);
        //if the command does not exist, try to get it by his alias
        if (!command) command = client.commands.get(client.aliases.get(cmd));
        var customcmd = false;
        var cuc = await client.customcommands.get(message.guild.id + ".commands");
        if (cuc && Array.isArray(cuc)) {
            for (const cmd of cuc) {
                if (cmd.name.toLowerCase() === message.content.slice(prefix.length).split(" ")[0]) {
                    customcmd = true;
                    if (cmd.embed) {
                        return message.reply({
                            embeds: [new MessageEmbed()
                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                                .setFooter(client.getFooter(es))
                                .setDescription(cmd.output)]
                        });
                    } else {
                        message.reply(cmd.output)
                    }
                }
            }
        } else {
            console.warn("CUSTOM COMMANDS INVALID SOURCE:", cuc)
        }
        //if the command is now valid
        if (command && !customcmd) {
            if (!command || command.length == 0) {
                if (unkowncmdmessage) {
                    message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, { prefix: prefix }))
                            .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, { prefix: prefix }))]
                    }).then(async msg => {
                        setTimeout(() => {
                            try {
                                msg.delete().catch(console.error)
                            } catch { }
                        }, 5000)
                    }).catch(console.error)
                }
                //RETURN
                return
            }
            if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
                client.cooldowns.set(command.name, new Discord.Collection());
            }
            const now = Date.now(); //get the current time
            const timeStamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
            const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
            if (timeStamps.has(message.author?.id)) { //if the user is on cooldown
                let expirationTime = timeStamps.get(message.author?.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
                if (now < expirationTime) { //if he is still on cooldonw
                    let timeLeft = (expirationTime - now) / 1000; //get the lefttime
                    if (timeLeft < 1) timeLeft = Math.round(timeLeft)
                    if (timeLeft && timeLeft != 0) {
                        not_allowed = true;
                        return message.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(es.wrongcolor)
                                .setTitle(handlemsg(client.la[ls].common.cooldown, { time: timeLeft.toFixed(1), commandname: command.name }))]
                        }
                        ).catch(console.error) //send an information message
                    }
                }
            }
            timeStamps.set(message.author?.id, now); //if he is not on cooldown, set it to the cooldown
            setTimeout(() => timeStamps.delete(message.author?.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
            try {
                client.stats.add(message.guild.id + ".commands", 1); //counting our Database stats for SERVER
                client.stats.add("global.commands", 1); //counting our Database Stats for GLOBA
                //if Command has specific permission return error
                if (command.memberpermissions) {
                    if (!message.member?.permissions?.has(command.memberpermissions)) {
                        not_allowed = true;
                        try {
                            message.react("998643650378616963").catch(() => { });
                        } catch { }
                        message.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(es.wrongcolor)
                                .setFooter(client.getFooter(es))
                                .setTitle(client.la[ls].common.permissions.title)
                                .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)]
                        }
                        ).then(async msg => {
                            setTimeout(() => {
                                try {
                                    msg.delete().catch(console.error)
                                } catch { }
                            }, 5000)
                        }).catch(console.error)
                    }
                }
                ///////////////////////////////
                ///////////////////////////////
                ///////////////////////////////
                ///////////////////////////////
                //run the command with the parameters:  client, message, args, user, text, prefix,
                if (not_allowed) return;

                //Execute the Command
                command.run(client, message, args, message.member, args.join(" "), prefix, es, ls, guild_settings);
            } catch (e) {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.somethingwentwrong)
                        .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).grey.substring(0, 2000) : String(e).grey.substring(0, 2000)}\`\`\``)]
                }).then(async msg => {
                    setTimeout(() => {
                        try {
                            msg.delete().catch(console.error)
                        } catch { }
                    }, 5000)
                }).catch(console.error)
            }
        } else if (!customcmd) {
            if (unkowncmdmessage) {
                message.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, { prefix: prefix }))
                        .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, { prefix: prefix }))]
                }).then(async msg => {
                    setTimeout(() => {
                        try {
                            msg.delete().catch(console.error)
                        } catch { }
                    }, 5000)
                }).catch(console.error)
            }
            return
        }
    } catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setTitle(":x: An error occurred")
                .setDescription(`\`\`\`${e.message ? e.message : String(e).grey.substring(0, 2000)}\`\`\``)]
        }).catch(console.error)
    }
}
