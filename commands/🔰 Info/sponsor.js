const { MessageEmbed } = require("discord.js")
const config = require(`../../configs/config.json`)
var ee = require(`../../configs/embed.json`)
const emoji = require(`../../configs/emojis.json`);
const { swap_pages2 } = require(`../../handlers/functions`);
module.exports = {
	name: "sponsor",
	category: "🔰 Info",
	aliases: ["sponsors"],
	description: "Shows the sponsor of this BoT",
	usage: "sponsor",
	type: "bot",
	run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {

		return message.reply(client.la[ls].cmds.info.sponsor.variable6)
	}
}
