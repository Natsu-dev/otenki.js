const Discord = require('discord.js');
const {getWeatherData} = require("../getWeatherData.js");

// 全国の天気
module.exports = {
    name: 'forecast',
    description: 'forecast',
    async execute(client, command, args, message) {
        getWeatherData()
            .then(resolve => {
                console.log(resolve);
                message.channel.send({embeds: [resolve]})
                    .then(r => console.log('Sent a forecast message.'));
            });
    }
}