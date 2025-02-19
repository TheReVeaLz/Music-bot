module.exports = {
    app: {
        token: process.env.DISCORD_TOKEN || 'xxx',
        playing: 'X',
        global: true,
        guild: process.env.GUILD_ID || 'xxx',
        extraMessages: false,
        loopMessage: false,
        lang: 'en',
        enableEmojis: false,
    },

    emojis:{
        'back': '⏪',
        'skip': '⏩',
        'ResumePause': '⏯️',
        'savetrack': '💾',
        'volumeUp': '🔊',
        'volumeDown': '🔉',
        'loop': '🔁',
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        Translate_Timeout: 10000,
        maxVol: 150,
        spotifyBridge: true,
        volume: 100,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 1800_000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 1800_000,
        discordPlayerYoutubei: {
            streamOptions: {
                useClient: "ANDROID",
                highWaterMark: 1 << 22
            },
            slicePlaylist: true
        }
    }
};
