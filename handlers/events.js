const fs = require('fs')
const allevents = [];
module.exports = (client) => {
    try {
        let dateNow = Date.now();
        console.log(`${String("[ ] :: ".magenta)}Loading the Events ...`.grey);
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith('.js'))
            for (const file of event_files) {
                try {
                    const event = require(`../events/${dir}/${file}`)
                    let eventName = file.split(".")[0];
                    if (eventName == "message") continue;
                    allevents.push(eventName);
                    client.on(eventName, event.bind(null, client));
                } catch (e) {
                    // console.log(String(e.stack).gray.bgRed); //use this only for debug!
                }
            }
        }
        ["client", 
         "client/shards",
         "server"].forEach(e => load_dir(e));

        // console.log(`[x] :: `.magenta + `LOADED THE ${allevents.length} EVENTS after: `.green + `${Date.now() - dateNow}ms`.green);
        console.log(`[x] :: `.magenta + `${allevents.length} EVENTS LOADED after: `.green + `${Date.now() - dateNow}ms`.green);
       /* try {
            const stringlength2 = 69;
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow)
            console.log(`     ┃`.bold.yellow + " ".repeat(-1 + stringlength2 - ` | `.length) + " ┃".bold.yellow)
            console.log(`     ┃`.bold.yellow + `Logging into the BOT...`.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃`.length - `Logging into the BOT...`.length) + "┃".bold.yellow)
            console.log(`     ┃`.bold.yellow + " ".repeat(-1 + stringlength2 - ` | `.length) + " ┃".bold.yellow)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
        } catch {

        }*/
    } catch (e) {
        console.log(String(e.stack).grey.bgRed);
    }
}