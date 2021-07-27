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

exports.getWholeWeather = async () => new Promise((resolve, reject) => {
    Promise.all([
        downloadJson('010000'), // 全国予報のjsonを取ってくる
        openCodesFile(), // テロップ番号対応表
    ]).then((values) => {
        const tenki = values[0];
        const codes = values[1];

        const optionDate = Date.tomorrow();
        const reportDatetime = new Date(tenki[0].srf.reportDatetime);

        // 該当の日付がリストの何番目にあるか探す
        const optionIndex = tenki[0].srf.timeSeries[0].timeDefines.findIndex(element => Date.equals(new Date(element), optionDate));

        // Embedの初期化
        let forecast = new Discord.MessageEmbed()
            .setTitle(optionDate.toFormat('YYYY年MM月DD日') + 'の全国の天気')
            .setColor('0x219ddd')
            .setDescription(reportDatetime.toFormat('YYYY年MM月DD日 HH24時MI分') + ' 発表')
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
        resolve(forecast);
    });
})

exports.getLocalWeather = async primaryAreaCode => new Promise((resolve, reject) => {
    Promise.all([
        downloadJson(primaryAreaCode), // 天気予報のjsonを取ってくる
        openCodesFile(), // テロップ番号対応表
    ]).then((values) => {
        const tenki = values[0];
        const codes = values[1];

        const optionDate = Date.tomorrow();
        const prefName = tenki[1].timeSeries[0].areas[0].area.name;
        const reportDatetime = new Date(tenki[0].reportDatetime);
        console.log(prefName, reportDatetime)

        // 該当の日付がリストの何番目にあるか探す
        const optionIndex = tenki[0].timeSeries[0].timeDefines.findIndex(element => Date.equals(new Date(element), optionDate));

        let forecast = new Discord.MessageEmbed()
            .setTitle(optionDate.toFormat('YYYY年MM月DD日') + 'の' + prefName + 'の天気')
            .setColor('0x219ddd')
            .setDescription(reportDatetime.toFormat('YYYY年MM月DD日 HH24時MI分') + ' 発表')
            .setURL('https://www.jma.go.jp/bosai/forecast/');

        // ここループでぶん回して全エリア引っこ抜く
        tenki[0].timeSeries[0].areas.forEach(city => {

            const name = city.area.name;
            const weatherCode = city.weatherCodes[optionIndex];

            let weatherName, weatherEmoji;
            for (let key in codes) {
                if (key === weatherCode) {
                    weatherName = codes[key][0];
                    weatherEmoji = codes[key][2];
                }
            }
            forecast.addField(name, weatherEmoji + '\n' + weatherName, true);
        });
        resolve(forecast);
    });
})
