const Discord = require('discord.js');
const {getWholeWeather} = require("../getWeatherData.js");
const client = new Discord.Client();
module.exports = {
    name: 'forecast',
    description: 'forecast',
    async execute(client, command, args, message) {
        getWholeWeather()
            .then(resolve => {
                console.log(resolve);
                message.channel.send(resolve);
            });
    }
}