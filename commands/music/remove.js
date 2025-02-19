const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'remove',
    description: "remove a song from the queue",
    voiceChannel: true,
    options: [
        // {
        //     name: 'song',
        //     description:('the name/url of the track you want to remove'),
        //     type: ApplicationCommandOptionType.String,
        //     required: false,
        // },
        {
            name: 'number',
            description:('the place in the queue the song is in'),
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        try {
            const queue = useQueue(inter.guild);
            if (!queue?.isPlaying()) return inter.reply(await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`));
    
            const number = inter.options.getNumber('number') - 1;
            if (number == null) return inter.reply(await Translate(`You have to use one of the options to remove a song <${inter.member}>... try again ? <❌>`));

            const track = queue.tracks.toArray()[number];
            if (!track) return inter.reply(await Translate(`This track does not seem to exist <${inter.member}>...  try again ? <❌>`));
            queue.removeTrack(number);
    
            return inter.reply(await Translate(`Removed <**[${track.title}](${track.url})**> from the queue <✅>`));
        } catch (err) {
            console.error(err);
            inter.reply(await Translate(`Something is wrong. <❌>`));
        }
    }
}
