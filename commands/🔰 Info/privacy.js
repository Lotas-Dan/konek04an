const {
    MessageEmbed
} = require('discord.js')
const config = require(`../../configs/config.json`)
module.exports = {
    name: "privacy",
    category: "🔰 Info",
    usage: "privacy",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
        return message.reply({embeds : [new MessageEmbed()
        .setTitle('\`konek04an\` Privacy Policy')
        .setColor(es.color)
        .addField("» What’s collected? 📩",
        `› The following data is collected and required for \`konek04an\` to provide you with full functionality of the service:
        › - your user id
        › - ids of Discord servers
        › - any user-inputted data from \`konek04an\` commands`)
        .addField("» Is this data shared? 📬",
        `› This data isn’t disclosed to any third parties.
        › It is only available to \`konek04an\` scope.`)
        .addField("» What are my rights to this data? 👤",
        `› The owner of a server that \`konek04an\` is in consents on these terms on behalf of all server members.
        › You can request the retention and deletion of data by joining the [Official Server](https://discord.gg/U5r2pMuRHG) and submitting a request`)]})
    }   
}