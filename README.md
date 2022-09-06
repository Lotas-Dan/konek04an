# [konek04an](https://github.com/Lotas-Dan/konek04an)

<a href="https://discord.gg/U5r2pMuRHG"><img src="https://discord.com/api/guilds/996497085077659720/widget.png?style=banner2"></a>

[**Invite the Public Version of this Bot**](https://discord.com/api/oauth2/authorize?client_id=909114894601830400&permissions=1387207847159&scope=bot)
so you don't need to host it by yourself

_Make sure your Node.js version is higher or equal:_

```
node >= 16.6.0
```

_And NPM:_

```
npm >= 8.10.0
```

# Installation Guide

## Hosting Requirements

### System Requirements

- min. 300mB Ram, suggested: 500mb (as it takes 300mb on idle
- 1 Core with min. 2.4ghz

### Recommendations

- a VPS would be adviced, so you don't need to keep your pc/laptop/raspi 24/7 online!

## Configuration and Starting

1.  Fill in all required data in `./configs/config.json`
2.  Now start the bot by typing opening a cmd in that folder and type: `node index.js` or `npm start`

## Where to get which Api-Key(s)

1. `./botconfig/config.json`
   - `token` you can get from: [discord-Developers](https://discord.com/developers/applications)
   - `ownersIDS` right click on yourself and select `Copy ID`
2. `./database_config.json`

   - `mongoUri` is your MongoUri
   <details>

   <summary>Connection Options</summary>

   - `dbName` The name of the database you want to use. If not provided, Mongoose uses the database name from connection string.
   - `useUnifiedTopology`
   - `maxPoolSize` The maximum number of connections in the connection pool.
   - `minPoolSize` The minimum number of connections in the connection pool.
   - `retryWrites` Enable retryable writes.
   - `writeConcern` The write concern w value
   - `keelAlive` TCP Connection keep alive enabled

   </details>

3. `./cluster_config.json`

   <details>

   <summary>Settings</summary>

   - `totalShard` Amount of internal shards which will be spawned
   - `totalClusters` Amount of processes/clusters which will be spawned
   - `shardPerCluster` Amount of shards which will be in one process/cluster

  </details>
   
# Support
> You can always Support me by inviting my Discord bot<br>
> This Bot was made by [LotasDan/K1ko](https://github.com/Lotas-Dan).

# Credits

> If consider using this Bot, make sure to credit me!
