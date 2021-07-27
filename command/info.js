const Discord = require('discord.js');
const client = new Discord.Client();
const otenki = require('../otenki.js');

const VERSION = '1.0.1';

module.exports = {
    name: 'info',
    description: 'info',
    async execute(client, command, args, message) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle('おてんき bot')
                .setColor('0x219ddd')
                .setDescription('Version' + VERSION)
                .setURL('https://github.com/Natsu-dev/otenki')
        )
    }
}
