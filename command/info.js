const Discord = require('discord.js');
const {infoEmbed} = require("../infoEmbed");

module.exports = {
    name: 'info',
    description: 'info',
    async execute(client, command, args, message) {
        message.channel.send({embeds: [infoEmbed()]})
            .then(r => console.log('Sent an info message.'))
    }
}
