const Discord = require('discord.js');
const {getWeatherData} = require("../getWeatherData.js");
const {getSimpleLocalWeather} = require("../getWeatherData");

// 全国の天気
module.exports = {
    name: 'forecast',
    description: 'forecast',
    async execute(client, command, args, message) {
        // 仮実装
        if (args[0] === '岡山' || args[0] === '330000') {
            getSimpleLocalWeather('330000')
                .then(resolve => {
                    console.log(resolve);
                    message.channel.send({embeds: [resolve]})
                        .then(r => console.log('Sent a forecast message.'));
                })
        } else if (args[0]) {
            getSimpleLocalWeather(args[0])
                .then(resolve => {
                    console.log(resolve);
                    message.channel.send({embeds: [resolve]})
                        .then(r => console.log('Sent a forecast message.'));
                })
        } else {
            getWeatherData()
                .then(resolve => {
                    console.log(resolve);
                    message.channel.send({embeds: [resolve]})
                        .then(r => console.log('Sent a forecast message.'));
                })
        }
    }
}