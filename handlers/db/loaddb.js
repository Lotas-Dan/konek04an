const { mongoUri, connectionOptions: db } = require('../../database_config.json');
const { Database } = require('quickmongo');
const { dbEnsure, delay } = require('../functions');
const OS = require('os')
const ee = require('../../configs/embed.json');
module.exports = async (client, enableGiveaways = true, /*redisOptions = false*/) => {
    return new Promise(async (res) => {

       // CACHE DURATION OPTIONS
       process.env.DB_cache_ping = 10_000; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 60_000]
       process.env.DB_cache_get = 0; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 300_000]
       process.env.DB_cache_all = 0; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 600_000]
       // You can also add: db.get(key, true) // to force-fetch the db

        let dateNow = Date.now();
        console.log(`${String("[ ] :: ".magenta)}Connecting to Database ...`.green);

        client.database = new Database(mongoUri, {
            dbName: db.dbName,
            useUnifiedTopology: db.useUnifiedTopology,
            maxPoolSize: db.maxPoolSize,
            minPoolSize: db.minPoolSize,
            // retryWrites: db.retryWrites,
            // w: db.writeConcern
            keepAlive: db.keepAlive
        })

        // if(!redisOptions) {
        //     await client.database.connectToRedis(redisOptions)
        //     console.log("        ↳ Connected to Redis".green);
        // }

        client.database.on('ready', async () => {
            // Creating the Tables
            client.notes = new client.database.table('notes')

            client.economy = new client.database.table('economy')

            client.invitesdb = new client.database.table('InviteData')

            client.mutes = new client.database.table('mutes')

            client.snipes = new client.database.table('snipes')

            client.stats = new client.database.table('stats')

            client.afkDB = new client.database.table('afkDB')

            client.settings = new client.database.table('settings')

            client.jointocreatemap = new client.database.table('jointocreatemap')

            client.joinvc = new client.database.table('joinvc')

            client.setups = new client.database.table('setups')

            client.modActions = new client.database.table('actions')

            client.userProfiles = new client.database.table('userProfiles')

            client.jtcsettings = new client.database.table('jtcsettings')

            client.roster = new client.database.table('roster')

            client.autosupport = new client.database.table('autosupport')

            client.menuticket = new client.database.table('menuticket')

            client.menuapply = new client.database.table('menuapply')

            client.apply = new client.database.table('apply')

            client.modal = new client.database.table('modal')

            client.points = new client.database.table('points')

            client.voicepoints = new client.database.table('voicepoints')

            client.reactionrole = new client.database.table('reactionrole')

            client.blacklist = new client.database.table('blacklist')

            client.customcommands = new client.database.table('customcommands')

            client.keyword = new client.database.table('keyword')

            client.premium = new client.database.table('premium')

            client.epicgamesDB = new client.database.table('epicgamesDB')

            client.Anti_Nuke_System = new client.database.table('Anti_Nuke_System')

            client.backupDB = new client.database.table('backupDB')

            client.giveawayDB = new client.database.table('giveawayDB')

            const Dbping = await client.database.ping();

            console.log(`[x] :: `.magenta + `DATABASE CONNECTED after: `.green + `${Date.now() - dateNow}ms\n     ↳ Database got a ${Dbping}ms ping`.green);

            await dbEnsure(client.stats, 'global', {
                commands: 0,
                songs: 0,
            });
            await dbEnsure(client.afkDB, 'REMIND', {
                REMIND: []
            });
            await dbEnsure(client.mutes, 'MUTES', {
                MUTES: []
            });
            let obj = {};
            for (let i = 0; i <= 100; i++) {
                obj[`tickets${i != 0 ? i : ""}`] = [];
                obj[`menutickets${i != 0 ? i : ""}`] = [];
                obj[`applytickets${i != 0 ? i : ""}`] = [];
            }

            await dbEnsure(client.setups, 'TICKETS', obj);
            if(enableGiveaways) mngGiveaways()
            res(true);
        });

        let errortrys = 0;
        client.database.on('error', async () => {
            console.log("[DB => Connection] ERRORED".bgRed)
            errortrys++
            if (errortrys == 5) return console.log(`Can't reconnect, it's above try limimt`.bgRed);
            await delay(2_000);
            await client.database.connect();
        })

        let closetrys = 0;
        client.database.on('close', async () => {
            console.log("[DB => Connection] CLOSED".bgRed)
            closetrys++
            if (closetrys == 5) return console.log(`Cant' reconnect, it's above try limit`.bgRed);
            await delay(2_000);
            await client.database.connect();
        })

        let disconnecttrys = 0;
        client.database.on('disconnected', async () => {
            console.log("[DB => Connection] DISCONNECTED".bgRed);
            disconnecttrys++;
            if (disconnecttrys == 5) return console.log(`Can't reconnect, it's above try limit`.bgRed);
            await delay(2_000);
            await client.database.connect();
        })

        // top-level awaits
        await client.database.connect()
        async function mngGiveaways() {
            const { MessageEmbed } = require('discord.js');
            const { GiveawaysManager } = require('discord-giveaways');
            const customGiveawayManager = class extends GiveawaysManager {
                async getAllGiveaways() {
                    return await client.giveawayDB.all(true);
                }
                async saveGiveaway(messageId, giveawayData) {
                    await client.giveawayDB.set(messageId, giveawayData);
                    return true;
                }
                async editGiveaway(messageId, giveawayData) {
                    await client.giveawayDB.set(messageId, giveawayData);
                    return true;
                }
                async deleteGiveaway(messageId) {
                    await client.giveawayDB.delete(messageId);
                    return true;
                }
            };

            const manager = new customGiveawayManager(client, {
                default: {
                    botsCanWin: false,
                    embedColor: ee.color,
                    embedColorEnd: ee.wrongcolor,
                    reaction: '🎉'
                }
            });
            // We now have a giveawaysManager property to access the manager everywhere!
            client.giveawaysManager = manager;
            client.giveawaysManager.on('giveawayReactionAdded', async (giveaway, member, reaction) => {
                try {
                    const isNotAllowed = await giveaway.exemptMembers(member);
                    if (isNotAllowed) {
                        member.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setThumbnail(member.guild.iconURL({ dynamic: true }))
                                    .setAuthor(client.getAuthor(`Missing the Requirements`, `https://cdn.discordapp.com/emojis/906917501986820136.png?size=128`))
                                    .setDescription(`> **Your are not fullfiling the Requirements for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), please make sure to fullfill them!.**\n\n> Go bakc to the Channel: <#${giveaway.channelId}>`)
                                    .setFooter(client.getFooter(member.guild.name, member.guild.iconURL({ dynamic: true })))
                            ]
                        }).catch(() => { });
                        reaction.users.remove(member.user).catch(() => { });
                        return;
                    }
                    let BonusEntries = await giveaway.checkBonusEntries(member.user).catch(() => { }) || 0;
                    if (BonusEntries) BonusEntries = 0;
                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.color)
                                .setThumbnail(member.guild.iconURL({ dynamic: true }))
                                .setAuthor(client.getAuthor(`Giveaway Entry Confirmed`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`))
                                .setDescription(`> ** Your entry for [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.**\n\n**Prize:**\n> ${giveaway.prize}\n\n*Winnersamount:**\n> \`${giveaway.winnercount}\`\n\n**Your Bonus Entries**\n> \`${BonusEntries}\`\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                                .setFooter(client.getFooter(member.guild.name, member.guild.iconURL({ dynamic: true })))
                        ]
                    }).catch(() => { });
                    console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
                } catch (e) {
                    console.log(e);
                }
            });
            client.giveawaysManager.on('giveawayReactionRemoved', async (giveaway, member, reaction) => {
                try {
                    member.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setThumbnail(member.guild.iconURL({ dynamic: true }))
                                .setAuthor(client.getAuthor(`Giveaway Left!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`))
                                .setDescription(`> **You left [thif Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) and aren't participating animore.**\n\n> Go back to the Channel: <#${giveaway.channelId}>`)
                                .setFooter(client.setFooter(member.guild.name, member.guild.iconURL({ dynamic: true })))
                        ]
                    }).catch(() => { });
                    console.log(`${member.user.tag} left giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
                } catch (e) {
                    console.log(e);
                }
            });
            client.giveawaysManager.on('giveawayEnded', async (giveaway, winners) => {
                for await (const winner of winners) {
                    winner.send({
                        contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway.`,
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.color)
                                .setThumbnail(winner.guild.iconURL({ dynamic: true }))
                                .setAuthor(client.getAuthor(`Giveaway Won!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`))
                                .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
                                .setFooter(client.getFooter(winner.guild.name, winner.guild.iconURL({ dynamic: true })))
                        ]
                    }).catch(() => { });
                }
                console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((win) => win.user.username).join(', ')}`);
            });
            client.giveawaysManager.on('giveawayRerolled', async (giveaway, winners) => {
                for await (const winner of winners) {
                    winner.send({
                        contents: `Congratulations, **${winner.user.tag}**! You won the Giveaway through a \`reroll\`.`,
                        embeds: [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setThumbnail(winner.guild.iconURL({ dynamic: true }))
                                .setAuthor(client.getAuthor(`Giveaway Won!`, `https://cdn.discordapp.com/emojis/833101995723194437.gif?size=128`))
                                .setDescription(`> **You won [this Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}), congrats!**\n\n> Go to the Channel: <#${giveaway.channelId}>\n\n**Prize:**\n> ${giveaway.prize}`)
                                .setFooter(client.getFooter(winner.guild.name, winner.guild.iconURL({ dynamic: true })))
                        ]
                    }).catch(() => { });
                }
            });
        }
        /*client.database.connect().then(() => {
        })*/
        /*database.on("ready", async () => {
            const DbPing = await database.ping();
            console.log(`[x] :: `.magenta + `CONNECTED TO DATABASE after: `.green + `${Date.now() - dateNow}ms`.green);
        })
        /*try{client.database = new Database(process.env.mongoDB || mongoDB, connectionOptions)
            client.database.on('ready', async () => {
                const DbPing = await client.database.ping();
                console.log(`[x] :: `.magenta + `CONNECTED TO DATABASE after: `.green + `${Date.now() - dateNow}ms`.green);
            })
        }catch(e){console.log(`[x] :: `.magenta + `FAILURE TO CONNECT TO DATABASE error: `.red + e);}*/
        /*await mongoose.connect(process.env.mongoDB || config.mongoDB, connectionOptions).then(() => {
            console.log(`[x] :: `.magenta + `CONNECTED TO DATABASE after: `.green + `${Date.now() - dateNow}ms`.green);
        }).catch((e) => {
            console.log(`[x] :: `.magenta + `FAILURE TO CONNECT TO DATABASE error: `.red + e);
        })*/
    })
}