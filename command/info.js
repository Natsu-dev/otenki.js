const Discord = require('discord.js');
const client = new Discord.Client();
const otenki = require('../otenki.js');
const {infoEmbed} = require("../infoEmbed");

module.exports = {
    name: 'info',
    description: 'info',
    async execute(client, command, args, message) {
        message.channel.send(infoEmbed());
    }
}
