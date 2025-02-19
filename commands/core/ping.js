const { MessageFlags } = require("discord.js");
const ms = require('ms');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'ping',
    description:("Get the ping of the bot!"),

    async execute({ client, inter }) {
        await inter.reply({ content: "Ping", flags: MessageFlags.Ephemeral });
        inter.editReply(await Translate(`Pong! API Latency is <${Math.round(client.ws.ping)}ms 🛰️>, last heartbeat calculated <${ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })}> ago`));
    }
};