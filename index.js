const { Manager, HeartbeatManager } = require('discord-hybrid-sharding');
const config = require('./configs/config.json');
const colors = require('colors');
const OS = require('os');
const { setting: bridgeSettings } = require('./cluster_config.json');

const manager = new Manager('./konek0.js', {
    token: process.env.token || config.token,
    totalShards: bridgeSettings.totelShard,
    shardsPerClusters: bridgeSettings.shardPerCluster,
    mode: 'process', // 'process' or 'worker';
    respawn: true,
    usev13: true,
    restarts: {
        max: 3,
        interval: 60000 * 60
    },
    queue: {
        auto: true
    }
});

manager.extend(
    new HeartbeatManager({
        interval: 10000,
        maxMissedHeartbeats: 5,
    }));

manager.on('clusterCreate', cluster => {
    console.log(`[SHARDING]:`.magenta + `launched Cluster #${cluster.id + 1} | ${cluster.id + 1}/${cluster.manager.totalClusters} [Shards per cluster ${cluster.manager.shardsPerClusters}/${cluster.manager.totalShards} Total Shards]`.green);

    cluster.on('death', function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} died...`)}`);
    });

    cluster.on('message', async (msg) => {
        if (!msg._sCustom) return;
        if (msg.dm) {
            const { interaction, message, dm, packet } = msg
            await manager.broadcast({ interaction, message, dm, packet })
        }
    });

    cluster.on('error', err => {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} errored ...`)}`);
        console.log(err);
    });

    cluster.on('disconnect', function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} disconnected ...`)}`);
    });

    cluster.on('reconnecting', function () {
        console.log(`${colors.yellow.bold(`Cluster ${cluster.id} reconnecting ...`)}`);
    });
});

manager.on('clientRequest', async (message) => {
    if(message._sRequest && message.songRequest){
        if(message.target === 0 || message.target) {
            const msg = await manager.clusters.get(message.target).request(message.raw);
            message.reply(msg)
        } else {
            manager.clusters.forEach(async cluster => {
               const msg = await  cluster.request(message.raw);
               message.reply(msg)
            })
        }
    }
})

// Log the creation of the debug
manager.once('debug', (d) => console.log(`|{x}|+> ${d} <+|{x}|`.dim))

manager.spawn({ timeout: -1 });