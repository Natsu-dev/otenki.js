const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
module.exports = {
    name: 'forecast',
    description: 'forecast',
    async execute(client,command,args,message){
        message.channels.send('forecast')
    }
}