const https = require("https");
const path = require("path");
const {Client} = require("pg")

require('dotenv').config({path: path.join(__dirname, '.env')});

exports.updateDatabase = async function (area) {
    let url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${area}.json`;
    let jsonData = {};
    await https.get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', () => {
            jsonData = JSON.parse(body);
        });
    }).on('error', (e) => {
        console.log(e.message); //エラー時
    });
    return jsonData
}

