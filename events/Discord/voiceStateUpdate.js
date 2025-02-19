const { useQueue } = require('discord-player');

module.exports = async (client, prevMember, newMember) => {
    if (!newMember)
        return;
    const queue = useQueue(newMember.guild);
    queue?.node?.resume();
}