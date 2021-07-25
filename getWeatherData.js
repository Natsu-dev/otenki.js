const https = require("https");
const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
require('date-utils');

require('dotenv').config({path: path.join(__dirname, '.env')});

const downloadJson = async areaCode => new Promise((resolve, reject) => {
    const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
    https.get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', (e) => reject(e.message));
});

const openCodesFile = async () => new Promise((resolve, reject) => {
    fs.readFile('./weatherCodes.json', 'utf8', (err, file) => {
        resolve(JSON.parse(file));
    });
});

getWeatherData = async primaryAreaCode => {
    Promise.all([
        downloadJson(primaryAreaCode), // 天気予報のjsonを取ってくる
        openCodesFile(), // テロップ番号対応表
    ]).then((values) => {
        const tenki = values[0];
        const codes = values[1];

        const optionDate = Date.tomorrow();
        const reportDatetime = new Date(tenki[0].srf.reportDatetime);

        // 該当の日付がリストの何番目にあるか探す
        const optionIndex = tenki[0].srf.timeSeries[0].timeDefines.findIndex(element => Date.equals(new Date(element), optionDate))

        // Embedの初期化
        let forecast = new Discord.MessageEmbed()
            .setTitle(optionDate.toFormat('YYYY年MM月DD日') + 'の天気')
            .setColor('0x219ddd')
            .setDescription(reportDatetime.toFormat('YYYY年MM月DD日 HH24時MI分') + ' 気象庁発表')
            .setURL('https://www.jma.go.jp/bosai/forecast/');

        // ここループでぶん回して全都市引っこ抜く

        tenki.forEach(city => {

            const name = city.name;
            const weatherCode = city.srf.timeSeries[0].areas.weatherCodes[optionIndex];

            let weatherName, weatherEmoji;
            for (let key in codes) {
                if (key === weatherCode) {
                    weatherName = codes[key][0];
                    weatherEmoji = codes[key][2];
                }
            }
            forecast.addField(name, weatherEmoji + '\n' + weatherName, true);
        });

        console.log(forecast);
    });
}

getWeatherData('010000').then(() => console.log('success!!!!!!')).catch((res, err) => console.log(res, err))
