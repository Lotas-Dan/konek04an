module.exports = {
    apps: [{
        name: 'konek0db',
        max_memory_restart: `5G`,
        script: 'index.js',
        // max_restarts: 5,
        cron_restart: "0 1 * * *"
    }]
};