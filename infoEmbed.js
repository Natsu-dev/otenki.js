const Discord = require("discord.js");

exports.infoEmbed = () => {

    return new Discord.MessageEmbed()
        .setTitle('おてんき bot')
        .setColor('0x219ddd')
        .setDescription('Version ' + '1.1.1')
        .setURL('https://github.com/Natsu-dev/otenki')
        .addField(':ballot_box_with_check: About',
            `毎日22時に気象庁発表の翌日の天気の情報を書き込むbotです。
            詳しい仕様はGitHubリポジトリ( https://github.com/Natsu-dev/otenki.js )に掲載していますので、必ずご一読ください。`,
            false)
        .addField(':ballot_box_with_check: Commands',
            `\`t:info\`, \`t:i\` このbotの説明が表示されます。
            \`t:forecast\`, \`t:f\` 全国版の今日の天気が表示されます。`,
            false)

}