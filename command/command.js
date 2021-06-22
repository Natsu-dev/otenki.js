const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
module.exports = {
    name: 'command',
    description: 'command hub',
    async execute(client, command, args, message){
        if (command === 'test'){
            message.channel.send('test')
        }
        if (command === 'forecast'){
            await client.commands.forecast.execute(client, command, args, message)
        }
    }
}
