const { 
    readdirSync } = require('fs');
const { MessageEmbed } = require('discord.js')
const serialize = require('serialize-javascript');
// const { Enmap } = require('enmap');
const ee = require('../configs/embed.json')

module.exports = client => {
    let dateNow = Date.now();
    console.log(`${String("[ ] :: ".magenta)}Loading Commands ...`.green);
    try {
        readdirSync('./commands/').forEach(dir => {
            const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
            for (let file of commands) {
                try {
                    let pull = require(`../commands/${dir}/${file}`);
                    if (pull.name) client.commands.set(pull.name, pull)
                    else continue;
                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
                } catch (e) {
                    console.log(String(e.stack).grey.bgRed);
                }
            }
        })
    } catch (e) {
        console.log(String(e.stack).gray.bgRed);
    }
    // client.backupDB = new Enmap({name: 'backups', dataDir: ''})
    // console.log(`[x] :: `.magenta + `LOADED THE ${client.commands.size} COMMANDS after: `.green + `${Date.now() - dateNow}ms`.green);
    console.log(`[x] :: `.magenta + `${client.commands.size} COMMANDS LOADED after: `.green + `${Date.now() - dateNow}ms`.green);

}