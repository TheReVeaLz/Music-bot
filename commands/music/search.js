const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'search',
    description: 'Search a song',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('The song you want to search'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        const player = useMainPlayer();
        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.YOUTUBE_SEARCH
        });

        if (!res?.tracks.length) return inter.reply({ content: await Translate(`No results found <${inter.member}>... try again ? <❌>`) });

        const queue = player.nodes.create(inter.guild, {
            metadata: {
                channel: inter.channel
            },
            spotifyBridge: client.config.opt.spotifyBridge,
            volume: client.config.opt.volume,
            leaveOnEmpty: client.config.opt.leaveOnEmpty,
            leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
        });

        const maxTracks = res.tracks.slice(0, 10);
        const content = `${maxTracks.map((track, i) => `${i + 1}. [${track.title}](<${track.url}>) \`(${track.duration})\``).join('\n')}\n\n Select choice between **1** and **${maxTracks.length}** or **cancel** ⬇️`;
        const reply = await inter.reply({ content, withResponse: true})

        const collector = inter.channel.createMessageCollector({
            time: 15000,
            errors: ['time'],
            filter: m => m.author.id === inter.member.id && m.channelId === inter.channelId
        });

        collector.on('collect', async (query) => {
            if (query.content.toLowerCase() === 'cancel') {
                return inter.followUp({ content: await Translate(`Search cancelled <✅>`), ephemeral: true });
            }

            const index = parseInt(query);
            if (!index || index <= 0 || index > maxTracks.length) return;

            const track = res.tracks[index - 1];
            const embed = new EmbedBuilder({
                author: {
                    name: `${track.title} (${track.duration})`,
                    url: track.url
                },
                description: `Added in "${inter?.member?.voice?.channel?.name}" 🎧`,
                thumbnail: {
                    url: track.raw.source === "youtube" ? track.thumbnail.split("?")[0] : track.thumbnail
                },
                color: 0x2F3136
            });

            queue.addTrack(track);
            reply?.resource?.message?.delete();
            query.reply({ embeds: [embed] });
            collector.stop();
            
            try {
                if (!queue.connection) await queue.connect(inter.member.voice.channel);
                if (!queue.isPlaying()) await queue.node.play();
            } catch {
                await player.deleteQueue(inter.guildId);
                return inter.followUp({ content: await Translate(`I can't join the voice channel... try again ? <❌>`), ephemeral: true });
            }
        });

        collector.on('end', async (msg, reason) => {
            if (reason === 'time') return inter.followUp({ content: await Translate(`Search timed out... try again ? <❌>`), ephemeral: true });
        });
    }
}
