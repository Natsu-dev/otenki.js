const fs = require('fs')
const https = require("https");
const path = require("path");
const {Client} = require("pg")

require('dotenv').config({path: path.join(__dirname, '.env')});

let area = '330000'

async function jsonDownload() {
    let url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${area}.json`;
    let jsonData = {};
    await https.get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', (res) => {
            res = JSON.parse(body);
            jsonData = JSON.parse(body);
            console.log(res);
            fs.writeFileSync(`./${area}.json`, JSON.stringify(res, null, '    '), 'utf8');
        });
    }).on('error', (e) => {
        console.log(e.message); //エラー時
    });
    return jsonData
}

async function databaseConnect() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'user',
        port: 5432,
    })
    await client.connect()
    console.log('Database Connect.')
    return client
}

async function jsonOpen() {
    return JSON.parse(fs.readFileSync('./330000.json', 'utf8'))
}

async function createDatabase(jsonData, client) {
    const areaCode = jsonData[1].timeSeries[0].areas[0].area.code;
    console.log(areaCode)

     client.query(
         `
             CREATE TABLE "public"."${areaCode}"
             (
                 "id"                serial,
                 "publishing_office" text,
                 "report_datetime"   timestamp,
                 "date_define"       timestamp unique,
                 "weather_code"      text,
                 "pops"              text,
                 "reliabilities"     text,
                 "temps_min"         text,
                 "temps_max"         text,
                 "created_at"        timestamp DEFAULT CURRENT_TIMESTAMP,
                 "updated_at"        timestamp DEFAULT CURRENT_TIMESTAMP
             );
         `
         , (err, res) => {
             console.log(err, res)
             client.end()
         })
}
async function run() {
    const client = await databaseConnect()
    const jsonData = await jsonOpen()

    await createDatabase(jsonData, client)
}

run().then(r => console.log('finish.'))
