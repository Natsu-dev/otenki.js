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

// 天気予報を取得しEmbedを返す
exports.getWeatherData = async (areaCode = '010000', optionDate) => new Promise((resolve, reject) => {

    // 取得するのが全国予報であればtrue
    const isWhole = (areaCode === '010000');

    // 気象庁の天気予報データDLとローカルの天気コード展開
    Promise.all([
        downloadJson(areaCode), // 全国予報のjsonを取ってくる
        openCodesFile(), // テロップ番号対応表
    ]).then((values) => {

        // resolve結果を整理
        const tenki = values[0];
        const codes = values[1];

        const prefName = (isWhole ? '全国' : tenki[1].timeSeries[0].areas[0].area.name);
        const reportDatetime = (isWhole ? new Date(tenki[0].srf.reportDatetime) : new Date(tenki[0].reportDatetime));
        const cities = (isWhole ? tenki : tenki[0].timeSeries[0].areas);

        let optionIndex = 1;
        if (!optionDate)
            // optionDateが指定されていない場合は発表翌日
            optionDate = (isWhole
                ? new Date(tenki[0].srf.timeSeries[0].timeDefines[optionIndex])
                : new Date(tenki[0].timeSeries[0].timeDefines[optionIndex]));
        else
            // 指定されている場合は該当の日付がリストの何番目にあるか探す
            optionIndex = (isWhole
                ? tenki[0].srf.timeSeries[0].timeDefines.findIndex(element => Date.equals(new Date(element), optionDate))
                : tenki[0].timeSeries[0].timeDefines.findIndex(element => Date.equals(new Date(element), optionDate)));

        // Embedの初期化
        let forecast = new Discord.MessageEmbed()
            .setTitle(optionDate.toFormat('YYYY年MM月DD日') + 'の' + prefName + 'の天気')
            .setColor('0x219ddd')
            .setDescription(reportDatetime.toFormat('YYYY年MM月DD日 HH24時MI分') + ' 発表')
            .setURL('https://www.jma.go.jp/bosai/forecast/');

        // ここループでぶん回して全都市引っこ抜く
        for (let i in cities) {
            const name = (isWhole ? cities[i].name : cities[i].area.name);
            const weatherCode = (isWhole
                ? cities[i].srf.timeSeries[0].areas.weatherCodes[optionIndex]
                : cities[i].weatherCodes[optionIndex]);
            const weather = (c => {
                for (let key in c) if (key === weatherCode) return c[key]
            })(codes); // 即時関数，"(codes)"は引数
            const temps = (isWhole
                ? cities[i].srf.timeSeries[2].areas.temps
                : ["-", "-"]); // TODO 地方版の気温の取り出し

            forecast.addField(name, weather[2] + '\n' + weather[0] + '\n' + temps[0] + '℃ / ' + temps[1] + '℃', true);
        };
        resolve(forecast);
    });
})

exports.getLocalWeather = async (primaryAreaCode, optionDate) => new Promise((resolve, reject) => {
    Promise.all([
        downloadJson(primaryAreaCode), // 天気予報のjsonを取ってくる
        openCodesFile(), // テロップ番号対応表
    ]).then((values) => {
        const tenki = values[0];
        const codes = values[1];

        const prefName = tenki[1].timeSeries[0].areas[0].area.name;
        const reportDatetime = new Date(tenki[0].reportDatetime);
        console.log(prefName, reportDatetime)

        let optionIndex = 1;
        if (!optionDate)
            // optionDateが指定されていない場合は発表翌日
            optionDate = new Date(tenki[0].timeSeries[0].timeDefines[optionIndex]);
        else
            // 指定されている場合は該当の日付がリストの何番目にあるか探す
            optionIndex = tenki[0].timeSeries[0].timeDefines.findIndex(element => Date.equals(new Date(element), optionDate));

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
