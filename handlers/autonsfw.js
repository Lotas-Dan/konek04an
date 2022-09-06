const Discord = require('discord.js');
var superagent = require('superagent');
const rp = require('request-promise-native');
var Cron = require('cron').CronJob;
const { dbEnsure, dbKeys, dbRemove, delay } = require('./functions');

module.exports = async client => {
    //Loop through every setupped guild every 10 minute and call the autonsfw command
    client.jobAutoNsfw = new Cron('0 */60 * * * *', async function () {
        //get all guilds which are setupped
        const guilds = await dbKeys(client.settings, d => d.data?.autonsfw+`.channel` && d.data?.autonsfw+`.channel` != 'no')
        //Loop through all guilds and send a random auto-generated-nsfw setup
        if (guilds.filter(d => client.guilds.cache.has(d)).length <= 0) return;
        for await (const guildid of guilds.filter(id => client.guilds.cache.has(id))) {
            await autoNsfw(guildid)
        }
    }, null, true, 'Europe/Berlin');

    client.jobAutoNsfw.start();

    var autoPost;

    //function for sending automatic nsfw
    async function autoNsfw(guildid) {
        return new Promise(async (res) => {
            try {
                // get the guild
                var guild = client.guilds.cache.get(guildid);
                // if no guild = return
                if (!guild) return res(false);
                // define a variable for the channel
                var channel;
                // get the settings
                let set = await client.settings.get(guild.id + '.autonsfw.channel');
                // if no settings found or define "no" return;
                if (!set || set == 'no') return res(false);
                // try to fetch the channel
                try {
                    channel = await client.channels.fetch(set).catch(() => null)
                    if (!channel || channel == null || channel == undefined || !channel.name || channel.name == null || channel.name == undefined) throw "Channel not found"
                    autoPost = channel;
                } catch (e) {
                    return res(false);
                }
                // if channel is not an NSFW channel return
                if (!channel.nsfw) return res(false);
                // get a img type from database 
                let imgType = await client.settings.get(guild.id + '.autonsfw.type')
                // define the array
                if (imgType == 'all') var mArray = ['ass', 'boobs', 'porn', 'akaneko', 'hmtai'];
                else if (imgType == 'anime') var mArray = ['akaneko', 'hmtai'];
                else var mArray = ['ass', 'boobs', 'porn'];
                // var mArray = ['ass', 'boobs', 'porn', 'akaneko'];
                // get a random method form the array
                var method = mArray[Math.floor(Math.random() * mArray.length)]

                if (method == "ass") {
                    rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function (res) {
                        return rp.get({
                            url: 'http://media.obutts.ru/' + res[0].preview,
                            encoding: null
                        });
                    }).then(function (res) {
                        const attach = new Discord.MessageAttachment(res);
                        channel.send({ files: [attach] }).catch(() => null);
                    });
                    return res(false)
                }
                //if the method is "porn"
                else if (method == "porn") {
                    superagent.get('https://nekobot.xyz/api/image').query({ type: 'pgif' }).end((err, response) => {
                        const attach = new Discord.MessageAttachment(response.body.message);
                        channel.send({ files: [attach] }).catch(() => null);
                    });
                    return res(false);
                }
                //if the method is "boobs"
                else if (method == "boobs") {
                    rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function (res) {
                        return rp.get({
                            url: 'http://media.oboobs.ru/' + res[0].preview,
                            encoding: null
                        });
                    }).then(function (res) {
                        const attach = new Discord.MessageAttachment(res);
                        channel.send({ files: [attach] }).catch(() => null);
                    });
                    return res(false);
                }
                //if the method is "akaneko"
                else if (method == 'akaneko'){
                    const cArray = ['ass', 'tentacles', 'bdsm', 'cum', 'hentai', 'uniform', 'panties', 'pussy', 'feet', 'maid', 'orgy', 'yuri', 'foxgirl']
                    let method = cArray[Math.floor(Math.random() * cArray.length)]
                    await akaneko(method)
                    return res(false);
                } 
                // if the method is "hmtai"
                else if(method == 'hmtai') {
                    const cArray = ['anal', 'ass', 'boobs', 'boobjob', 'bdsm', 'cum', 'hentai', 'uniform', 'pantsu', 'pussy', 'femdom', 'ero', 'creampie']
                    let method = cArray[Math.floor(Math.random() * cArray.length)]
                    await hmtai(method)
                    return res(false);
                }
                //else call "porn"
                else {
                    superagent.get('https://nekobot.xyz/api/image').query({ type: 'pgif' }).end((err, response) => {
                        const attach = new Discord.MessageAttachment(response.body.message);
                        channel.send({ files: [attach] }).catch(() => null);
                    });
                    return res(false);
                }
            } catch (e) {
                console.error(e)
                return res(false);
            };
            return res(true)
        })
        async function akaneko(category) {
            const { nsfw } = require('akaneko')
            return await eval(`nsfw.${category}().then(owo => {
                autoPost.send({
                    files: [owo]
                })
            })`)
        }
        async function hmtai(category) {
            const hmtai = require('hmtai')
            const nsfw = new hmtai().nsfw
            return await eval(`nsfw.${category}().then(owo => {
                autoPost.send({
                    files: [owo]
                })
            })`)
        }
    }
}