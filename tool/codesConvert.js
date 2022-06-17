const fs = require("fs");

const wcList = JSON.parse(fs.readFileSync('./codes.json', 'utf8'));
const result = {};

String.prototype.allReplace = function (obj) {
    let retStr = this;
    for (let x in obj) {
        retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
    }
    return retStr;
};

let n = 0;

for (let key in wcList) {
    console.log(key + ': ' + wcList[key]);
    const emoji = wcList[key][3].allReplace({
        '晴': ':sunny:',
        '曇': ':cloud:',
        '止む': ':cloud:',
        '大雨': ':umbrella::cloud_rain:',
        '強く降る': ':umbrella::cloud_rain:',
        '雨': ':umbrella:',
        '風雪強い': ':snowman2::dash:',
        '大雪': ':snowman2::cloud_snow:',
        '雪': ':snowman2:',
        '雷': ':zap:',
        '霧': ':fog:',
        '暴風': ':dash:',
        'みぞれ': ':umbrella::snowflake:',
        '朝の内': '',
        'で': '',
        'を伴う': '',
        '山沿い': ','
    }).replace(/朝夕一時|朝夕|夕方一時|日中時々|朝晩一時|後時々|後一時|時々|一時/g, '/')
        .replace(/後|昼頃から|夕方から|夜から|夜は|午後は/g, '→')
        .replace('か', ',');
    result[key] = [wcList[key][3], wcList[key][4], emoji];
    n++;
}
fs.writeFileSync('./weatherCodes.json', JSON.stringify(result));