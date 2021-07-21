const https = require("https");
const path = require("path");
const fs = require("fs");

require('dotenv').config({path: path.join(__dirname, '.env')});

async function downloadJson(areaCode) {
    return new Promise((resolve, reject) => {
        const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
        https.get(url, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', (e) => reject(e.message));
    });
}

const wcList = JSON.parse(fs.readFileSync('./input.json', 'utf8'));

updateDatabase = async primaryAreaCode => {
    Promise.all([downloadJson(areaCode), promise2, promise3]).then((values) => {
        console.log(values);
    });
    downloadJson(primaryAreaCode).then((jsonData) => {
        // 取ってきた天気予報のjsonを開く

        // テロップ番号対応表を開く

        // 何月何日何時気象庁発表

    })
}

updateDatabase('010000').then(() => console.log('success!!!!!!')).catch((res, err) => console.log(res, err))
