require('dotenv').config()

const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor')
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const cfg = require("./config");

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    disableMentions: 'everyone',
    presence: {
        activities: [ 
            {
                name: cfg.app.playing,
                type: ActivityType.Playing
            }
        ],
        status: "dnd"
    }
});

client.config = cfg;

const player = new Player(client);
// player.extractors.loadDefault();
player.extractors.register(YoutubeiExtractor, cfg.opt.discordPlayerYoutubei);
player.extractors.loadMulti([YoutubeiExtractor, ...DefaultExtractors]);

console.clear()
require('./loader');

client.login(client.config.app.token)
.catch(async (e) => {
    if(e.message === 'An invalid token was provided.'){
    require('./process_tools')
    .throwConfigError('app', 'token', '\n\t   ❌ Invalid Token Provided! ❌ \n\tchange the token in the config file\n')}

    else{
        console.error('❌ An error occurred while trying to login to the bot! ❌ \n', e)
    }
});
  
process.on("SIGINT", async function () {
    await client.destroy();
    process.exit();
});