const Discord = require('discord.js'),
    config = require('../configs/config.json'),
    fs = require('fs'),
    ee = require('../configs/embed.json');
module.exports = (client) => {
    /**********************************
     *@INFO All CLient Variables 
     *********************************/
    client.invites = {};
    client.checking = {};
    client.broadCastCache = new Discord.Collection();
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.slashCommands = new Discord.Collection();
    client.categories = fs.readdirSync('./commands/');
    client.cooldowns = new Discord.Collection();
}