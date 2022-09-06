const Discord = require('discord.js');
const config = require('../../configs/config.json');
const moment = require('moment');
const { nFormatter } = require('../../handlers/functions');
module.exports = async (client) => {
    try {
        change_status(client);
        //loop through the status per each 1,5 minutes
        setInterval(() => {
            change_status(client);
        }, 90 * 1000)
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
    }
}
let state = 0;
async function change_status(client) {
    if (state == 0) {
        for (id of client.cluster.ids.map(s => s.id)) {
            client.user.setActivity(`${config.status.status1}`
                .replace("{prefix}", config.prefix)
                .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                .replace("{createdTime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                .replace("{name}", client.user.username)
                .replace("{tag}", client.user.tag)
                .replace("{commands}", client.commands.size)
            )
        }
    } else if (state == 1) {
        for (id of client.cluster.ids.map(s => s.id)) {
            client.user.setActivity(`${config.status.status2}`)
        }
    } else {
        for (id of client.cluster.ids.map(s => s.id)) {
            client.user.setActivity(`${config.status.status3}`)
        }
    }
    state == 2 ? state = 0 : state++;
    if (client.ad.enabled) {
        setTimeout(() => {
            client.user.setActivity(client.ad.statusad);
        }, (90 - 15) * 1000)
    }
}