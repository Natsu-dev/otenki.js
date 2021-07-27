const Discord = require("discord.js");


exports.infoEmbed = (version) => {
    return new Discord.MessageEmbed()
        .setTitle('おてんき bot')
        .setColor('0x219ddd')
        .setDescription('Version ' + version)
        .setURL('https://github.com/Natsu-dev/otenki')
}