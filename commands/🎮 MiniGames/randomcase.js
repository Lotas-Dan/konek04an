
const { MessageEmbed } = require("discord.js");
const config = require(`../../configs/config.json`);
var ee = require(`../../configs/embed.json`);

module.exports = {
    name: "randomcase",
    aliases: ["randomcasetext"],
    category: "🎮 MiniGames",
    description: "Make Text to random Cases?",
    usage: "randomcase TEXT",
    type: "text",
     run: async (client, message, args, cmduser, text, prefix, es, ls, GuildSettings) => {
        
        if(GuildSettings.MINIGAMES === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        message.reply(randomCase(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
        
    }
  }
  function randomCase(string) {
		let result = '';
		if (!string) throw new TypeError('Error: A string was not specified.');
		if (typeof string !== 'string') {
			throw new TypeError('Error: Provided string is Invalid.');
		}
		for (const i in string) {
			const Random = Math.floor(Math.random() * 2);
			result += Random == 1 ? string[i].toLowerCase() : string[i].toUpperCase();
		}
		return result;
	}