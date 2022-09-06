const config = require('../configs/config.json');
let {
    MessageEmbed
} = require('discord.js');
const { escapeRegex, dbEnsure } = require('./functions');
const map = new Map();
module.exports.run = async (client) => {
    module.exports.messageCreate = async (client, message, guild_settings) => {
        if (!message.guild) return;
        let es = guild_settings.embed;
        let args = message.content.split(" ");
        let prefix = guild_settings.prefix;
        if (prefix === null) prefix = config.prefix;
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        let cuc = await client.keyword.get(message.guild.id + ".commands");
        if (!cuc && !Array.isArray(cuc)) {
            cuc = await dbEnsure(client.keyword, message.guild.id, {
                commands: []
            }) || [];
        }
        for await (const cmd of cuc) {
            for await (const string of args) {
                if (string && (String(string).toLowerCase() == (cmd.name.toLowerCase()) || (cmd.aliases.includes(String(string).toLowerCase()))) && cmd.channels.includes(message.channel.id)) {
                    if (!map.has(cmd.name + message.guild.id)) {
                        map.set(cmd.name + message.guild.id, true)
                        setTimeout(() => map.delete(cmd.name + message.guild.id), 5000)
                        if (cmd.embed) {
                            if (prefixRegex.test(message.content) && !cmd.name.starsWith(prefix)) return;
                            message.channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor(es.color)
                                    .setFooter(client.getFooter(es))
                                    .setDescription(cmd.output.replace("{member}", `<@${message.author.id}>`))]
                            });
                            continue;
                        } else {
                            //if its not that then return
                            if (prefixRegex.test(message.content) && !cmd.name.startsWith(prefix)) return;
                            message.channel.send(cmd.output.replace("{member}", `<@${message.author.id}>`))
                            continue;
                        }
                    }
                    else {
                    }
                    continue;
                }
            }
        }
    }
}