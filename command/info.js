const Discord = require('discord.js');
const client = new Discord.Client();
const otenki = require('../otenki.js');
const {infoEmbed} = require("../infoEmbed");

const VERSION = '1.0.1';

module.exports = {
    name: 'info',
    description: 'info',
    async execute(client, command, args, message) {
        message.channel.send(infoEmbed(VERSION));
    }
}
