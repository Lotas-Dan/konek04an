module.exports = (client, event, id) => {
    console.log(`[CM => Cluster] [${'DISCONNECT'.magenta}] Cluster disconnected, Shard #${id} | atTime: ${String(new Date()).split(' ', 5).join(' ')}`)
}