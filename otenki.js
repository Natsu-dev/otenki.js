const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = 't:';
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const {getWholeWeather} = require('./getWeatherData.js');

// 環境変数に.envを使う
require('dotenv').config({path: path.join(__dirname, '.env')});

// コマンド読み込み
let command_count = 0
const commandFiles = fs.readdirSync('./command').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    command_count++;
    const command = require(`./command/${file}`);
    console.log(command)
    client.commands.set(command.name, command);
}
console.log(`${command_count} files loaded.`)

// 定期実行の設定
cron.schedule('0 0 22 * * *', () => {
    client.guilds.cache.forEach(guild => {
        let channel = guild.channels.cache
            .find(channel => channel.type === 'text'
                && channel.permissionsFor(guild.me).has('SEND_MESSAGES')
                && channel.name.indexOf('天気予報') > -1)
        if (channel === undefined) {
            channel = guild.channels.cache
                .find(channel => channel.type === 'text'
                    && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        }
        getWholeWeather().then(resolve => channel.send(resolve));
    })
}, {
    scheduled: true,
    timezone: 'Asia/Tokyo'
})


// ログイン処理
client.on('ready', () => {
    client.user.setStatus('online') //online, idle, dnd, invisible
        .then(r => console.log('Status set.'))
        .catch(console.error);
    client.user.setActivity('t:info') //ステータスメッセージ
        .then(r => console.log('Activity set.'))
        .catch(console.error);

    console.log(`USER: ${client.user.username}`)
    console.log(`ID: ${client.user.id}`)
    console.log(`SERVERS:`)
    client.guilds.cache.forEach(guild =>
        console.log(`    ${guild.name}`)
    );

    console.log('ready...');
});

client.on('message', async message => {

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase(); //引数
    console.log(command)
    // -> command.js
    await client.commands.get('command').execute(client, command, args, message);

});

// サーバー参加時
client.on("guildCreate", guild => {
    let greetingChannel;
    greetingChannel = guild.channels.cache.find(channel => channel.type === 'text' && channel.name.indexOf('天気予報') > -1)
    if (greetingChannel === undefined) {
        greetingChannel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    }
    greetingChannel.send(
        // TODO ここ仮実装、きたないので後で直そう
        new Discord.MessageEmbed()
            .setTitle('おてんき bot')
            .setColor('0x219ddd')
            .setDescription('Version 1.0.1')
            .setURL('https://github.com/Natsu-dev/otenki')
    );
});

client.login(process.env.DISCORD_TOKEN) // Login phase
    .then(r => console.log('Login success.'))
    .catch(console.error);
