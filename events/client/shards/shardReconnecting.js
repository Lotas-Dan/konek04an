module.exports = (client, id) => {
    console.log(`[CM => Cluster] [${'RECONNECTING'.yellow}] Cluster reconnected, Shard #${id} | atTime: ${String(new Date()).split(' ', 5).join(' ')}`)
}