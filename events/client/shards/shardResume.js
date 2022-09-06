module.exports = (client, id, replayedEvents) => {
    console.log(`[CM => Cluster] [${'RESUME'.blue}] Cluster resumed, Shard #${id} | atTime: ${String(new Date()).split(' ', 5).join(' ')}`)
}