const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');
    
function SecondToDuration(second) {
    if (!second) return;
    second = parseInt(second, 10);
    let hhmmss = [Math.floor(second / 3600), Math.floor((second / 60) % 60), second % 60];

    for (let i = 0; i < hhmmss.length; i++) {
        if (!hhmmss[i] && !i) delete hhmmss[i];
        if (hhmmss[i] < 10) hhmmss[i] = `0${hhmmss[i]}`;
        if (hhmmss[i] && i != hhmmss.length - 1) hhmmss[i] = `${hhmmss[i]}:`;
    }

    return hhmmss.join("");
}

module.exports = {
    name: 'queue',
    description:('Get the songs in the queue'),
    voiceChannel: true,

    async execute({ client, inter }) {
        try {
            const queue = useQueue(inter.guild);
    
            if (!queue) return inter.reply({ content: await Translate(`No music currently playing <${inter.member}>... try again ? <❌>`) });
            if (!queue.tracks.toArray()[0]) return inter.reply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... try again ? <❌>`) });
    
            const methods = ['', ' 🔂', ' 🔁'];
            let queueDuration = 0;
            const tracks = queue.tracks.map((track, i) => {
                queueDuration += track.raw.duration_ms * 0.001;
                return `${i + 1}. [${track.title}](${track.url}) \`(${track.duration})\` - <@${track.requestedBy.id}>`;
            });
    
            const embed = new EmbedBuilder()
                .setColor('#992e22')
                // .setTitle(await Translate(`Song Queue<${methods[queue.repeatMode]}> | ${queue.tracks.size} entries | \`${SecondToDuration(queueDuration)}\``))
                .setAuthor({
                    name: `▶ ${queue.currentTrack.title} (${queue.currentTrack.duration})`,
                    url: queue.currentTrack.url
                })
                .setThumbnail(queue.currentTrack.raw.source === "youtube" ? queue.currentTrack.thumbnail.split("?")[0] : queue.currentTrack.thumbnail)
                .setDescription(await Translate(`<${tracks.slice(0, 10).join('\n')}>`))
                .setTimestamp();
            
            inter.reply({ embeds: [embed], content: await Translate(`Song Queue<${methods[queue.repeatMode]}> | ${queue.tracks.size} entries | \`${SecondToDuration(queueDuration)}\``), allowedMentions: { repliedUser: false } });
        } catch (err) {
            console.error(err);
            inter.reply(await Translate(`Something is wrong. <❌>`));
        }
    }
}