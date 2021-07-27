const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'command',
    description: 'command hub',
    async execute(client, command, args, message){
        if (command === 'test' || command === 't'){
            message.channel.send('test');
        }
        if (command === 'forecast' || command === 'f'){
            console.log('command: forecast');
            await client.commands.get('forecast').execute(client, command, args, message);
        }
        if (command === ('info')){
            console.log('command: info');
            await client.commands.get('info').execute(client, command, args, message);
        }
    }
}
