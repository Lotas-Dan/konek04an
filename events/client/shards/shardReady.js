module.exports = (client, id) => {
   console.log(`[CM => Cluster] [${'READY'.green}] Cluster ready, Shard #${id} | atTime: ${String(new Date()).split(' ', 5).join(' ')}`)
}