//#region Modules
/************************************************
 *  @param Import_Modules for index.js
 ***********************************************/
const Discord = require('discord.js');
const colors = require('colors');
const Cluster = require('discord-hybrid-sharding');
const fs = require('fs');
const OS = require('os');
const Events = require('events');
const ee = require('./configs/embed.json');
const config = require('./configs/config.json');
const ad = require('./configs/advertisement.json')
require('dotenv').config();
//#endregion

//#region Discord_CLient
/************************************************
 * @param Discord_Client
 ***********************************************/
const client = new Discord.Client({
    restTimeOffset: 0,
    failIfNotExists: false,
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER', 'GUILD_SCHEDULED_EVENT'],
    intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_INTEGRATIONS',
    'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INVITES', 'GUILD_WEBHOOKS',
    'GUILD_PRESENCES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'],
    presence: {
        activities: [{ name: `${config.status.status1}`.replace('${prefix}', config.prefix), type: config.status.type, url: config.status.url }],
        status: 'idle'
    }
});
const discordModals = require('discord-modals');
discordModals(client);
//#endregion

//#region AD
 /**********************************************************
  * @param Define_the_Client_Advertisments from the Config File
  *********************************************************/
  client.ad = {
    enabled: ad.adenabled,
    statusad: ad.statusad,
    spacedot: ad.spacedot,
    textad: ad.textad
  }
//#endregion AD

//#region Languages
/**************************************************
 * @param Languages
 *************************************************/
client.la = {}
let lang = fs.readdirSync('./langs')
for (const languages of lang.filter(file => file.endsWith('.json'))) {
    client.la[`${languages.split('.json').join('')}`] = require(`./langs/${languages}`)
}
Object.freeze(client.la)
//#endregion

//#region Max_Listeners
/**************************************************
 * @param Max_Listeners set to 0 (default 10)
 *************************************************/
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
//#endregion

//#region Bot_Functions
/**************************************************
 * @param {5} Load_The_Bot_Functions
 *************************************************/
async function reqHandler() {
    for await (const hand of [
        'extraevents',
        'clientvariables',
        'events',
        'command',
        'slashCommands']) {
        try {
            await require(`./handlers/${hand}`)(client);
        } catch (e) { console.error(e) }
    }

    await require(`./handlers/db/loaddb`)(client);//, true, {
    //     password: redis.password,
    //     url: redis.url,
    //     retry_strategy: () => 1000
    // });

    [
        'anti_nuke',
        'apply',
        'autobackup',
        // // // // // //
        'automeme',
        'autonsfw',
        'boostlog',
        'counter',
        'dailyfact',
        'jointocreate',
        'joinvc',
        'leave',
        'logger',
        'membercount',
        // // // // // //
        'mute',
        'reactionrole',
        'roster',
        'ticket',
        'ticketevent',
        'timedmessages',
        // 'welcome',
    ].forEach(hand => {
        try{ require(`./handlers/${hand}`)(client);
    } catch (e) { console.error(e) }
    });
    //handlers with .run
    [
        'aichat',
        'anticaps',
        'antidiscord',
        'antilinks',
        'antimention',
        'antiselfbot',
        'antispam',
        'autoembed',
        'blacklist',
        'ghost_ping_detector',
        'keyword',
        // 'ranking',
        'suggest',
        'validcode'
    ].forEach(hand => {
        try { require(`./handlers/${hand}`).run(client);
        } catch (e) { console.error(e) }
    });
} reqHandler().catch(e => {
    console.error(`${e}`.bgRed)
});

// example client function
client.testFunction = (data) => {
    console.log("testFunctionCalled", String(data))
    return "data " + String(data);
  }
  // example thingy
client.testPromiseFunction = async (data) => {
    await new Promise(r => setTimeout(() => r(2), 3000));
    return "promise-data: " + String(data);
}
  
client.once('ready', () => {
    console.log(`[x] :: `.magenta + `${client.user.tag} | status: ${'ready'.green} #${client.cluster.id}: ${[...client.cluster.ids.keys()].join(",")}`);
    //setInterval(() => {
        //client.machine.request({ ack: true, message: 'Are you alive?' })
        //.then(e => console.log('Are you alive?', e && e.message ? e.message : e));
        //}, 10000);
});
//#endregion

//#region Login_to_the_Bot
/**************************************************
 * @param {6} Login_to_the_Bot
 *************************************************/
    client.cluster = new Cluster.Client(client);
    client.login(process.env.token || config.token)
//#endregion

//#region Cluster DMS
/**************************************************
 * @Info Cluster DMS
 *************************************************/
client.cluster.on('message', async (msg) => {
    if (!msg._sCustom) return;
    if (msg.dm && msg.message) {
        client.actions.MessageCreate.handle(msg.packet);
    }
    if (msg.dm && msg.interaction) {
        client.actions.InteractionCreate.handle(msg.packet);
    }
})
client.on('raw', (packet) => {
    if (client.cluster.id !== 0) return;
    if (packet.t === "MESSAGE_CREATE" && !packet.d.guild_id) {
        client.cluster.send({
            dm: true,
            message: true,
            packet: packet.d
        });
    }
})
client.on('interactionCreate', (interaction) => {
    if (client.cluster.id !== 0) return;
    if (interaction.isSelectMenu() && !interaction.guildId && interaction.user.id !== client.user?.id) {
        const Types = {
            "PING": 1,
            "APPLICATION_COMMAND": 2,
            "MESSAGE_COMPONENT": 3,
            "APPLICATION_COMMAND_AUTOCOMPLETE": 4
        };
        client.cluster.send({
            dm: true,
            interaction: true,
            packet: {
                version: 1,
                type: 3,
                token: interaction.token,
                member: {
                    user: {
                        username: interaction.user.username,
                        public_flags: interaction.user.flags,
                        id: interaction.user.id,
                        discriminator: interaction.user.discriminator,
                        bot: interaction.user.bot,
                        avatar: interaction.user.avatar
                    }
                },
                message: {
                    type: 19,
                    tts: false,
                    timestamp: interaction.message.timestamp,
                    pinned: false,
                    message_reference: {
                        message_id: interaction.message.id,
                        guild_id: null,
                        channel_id: interaction.message.channelId
                    },
                    mentions: [],
                    mention_roles: [],
                    mention_everyone: false,
                    id: interaction.message.id,
                    flags: 0,
                    embeds: interaction.message.embeds.map(e => e.toJSON()),
                    edited_timestamp: null,
                    content: interaction.message.content,
                    components: interaction.message.components.map(c => c.toJSON()),
                    channel_id: interaction.message.channelId,
                    author: {
                        username: client.user?.username,
                        public_flags: client.user?.flags,
                        id: client.user?.id,
                        discriminator: client.user?.discriminator,
                        bot: client.user?.bot,
                        avatar: client.user?.avatar
                    },
                    attachments: interaction.message.attachments
                },
                user: {
                    username: interaction.user?.username,
                    public_flags: interaction.user?.flags,
                    id: interaction.user?.id,
                    discriminator: interaction.user?.discriminator,
                    bot: interaction.user?.bot,
                    avatar: interaction.user?.avatar
                },
                locale: interaction.locale,
                id: interaction.id,
                guild_locale: interaction.guildLocale,
                guild_id: interaction.guildId,
                data: {
                    values: interaction.values,
                    custom_id: interaction.customId,
                    component_type: Types[interaction.type]
                },
                channel_id: interaction.channelId,
                appication_id: interaction.applicationId,
            }
        })
    }
});
//#endregion