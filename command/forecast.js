const Discord = require('discord.js');
const {getWeatherData} = require("../getWeatherData.js");
const client = new Discord.Client();

// 全国の天気
module.exports = {
    name: 'forecast',
    description: 'forecast',
    async execute(client, command, args, message) {
        getWeatherData()
            .then(resolve => {
                console.log(resolve);
                message.channel.send(resolve);
            });
    }
}