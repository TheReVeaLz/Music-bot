const { QueryType, useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'play',
    description:("Play a song!"),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('The song you want to play'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter, client }) {
        const player = useMainPlayer();

        const song = inter.options.getString('song');
        // const res = await player.search(song, {
        //     requestedBy: inter.member,
        //     searchEngine: QueryType.YOUTUBE
        // });

        let defaultEmbed = new EmbedBuilder().setColor('#2f3136');

        // if (!res?.tracks.length) {
        //     defaultEmbed.setAuthor({ name: await Translate(`No results found... try again ? <❌>`) });
        //     return inter.editReply({ embeds: [defaultEmbed] });
        // }

        try {
            const ret = await player.play(inter.member.voice.channel, song, {
                nodeOptions: {
                    metadata: {
                        channel: inter.channel
                    },
                    volume: client.config.opt.volume,
                    leaveOnEmpty: client.config.opt.leaveOnEmpty,
                    leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
                    leaveOnEnd: client.config.opt.leaveOnEnd,
                    leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
                },
                requestedBy: inter.member,
                fallbackSearchEngine: QueryType.YOUTUBE_SEARCH
            });

            const { track, searchResult } = ret;
            const playlistLen = searchResult?._data?.playlist?.tracks?.length - 1;

            if (!track?.url) {
                defaultEmbed.setAuthor({ name: await Translate(`No results found... try again ? <❌>`) });
                return inter.reply({ embeds: [defaultEmbed] });
            }
            
            defaultEmbed.setAuthor({
                name: `${track.title} (${track.duration})`,
                url: track.url
              })
              .setDescription(`${playlistLen ? `Loaded ${playlistLen} additional tracks 🎧\n` : ""}Added in "${inter?.member?.voice?.channel?.name}" 🎧`)
              .setThumbnail(track.raw.source === "youtube" ? track.thumbnail.split("?")[0] : track.thumbnail)
              .setColor("#2f3136");

            // defaultEmbed.setAuthor({ name: await Translate(`Loading <${track.title}> to the queue... <✅>`) });
            inter.reply({ embeds: [defaultEmbed] });
        } catch (error) {
            console.log(`Play error: ${error}`);
            defaultEmbed.setAuthor({ name: await Translate(`I can't join the voice channel... try again ? <❌>`) });
            return inter.reply({ embeds: [defaultEmbed] });
        }
    }
}
