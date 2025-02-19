const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'playnext',
    description:("Play a song right after this one"),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('The song you want to play next'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);

        if (!queue?.isPlaying()) return inter.reply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });

        const song = inter.options.getString('song');
        const res = await player.search(song, {
            requestedBy: inter.member,
            fallbackSearchEngine: QueryType.YOUTUBE_SEARCH
        });

        if (!res?.tracks.length) return inter.reply({ content: await Translate(`No results found <${inter.member}>... try again ? <❌>`) });

        if (res.playlist) return inter.reply({ content: await Translate(`This command does not support playlist's <${inter.member}>... try again ? <❌>`) });

        queue.insertTrack(res.tracks[0], 0);

        const playNextEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${res.tracks[0].title} (${res.tracks[0].duration})`,
                url: res.tracks[0].url
            })
            .setDescription(`Added to next queue in "${inter?.member?.voice?.channel?.name}" 🎧`)
            .setThumbnail(res.tracks[0].raw.source === "youtube" ? res.tracks[0].thumbnail.split("?")[0] : res.tracks[0].thumbnail)
            .setColor("#2f3136");

        inter.reply({ embeds: [playNextEmbed] });
    }
}
