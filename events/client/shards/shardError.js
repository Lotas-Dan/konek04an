module.exports = (client, error, id) => {
    console.log(`[CM => Cluster] [${'ERROR'.red}] Cluster died, Shard #${id} | atTime: ${String(new Date()).split(' ', 5).join(' ')}`)
}