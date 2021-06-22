const fs = require('fs')
const https = require("https");
const path = require("path");
const request = require("request");
const { Client } = require("pg")

require('dotenv').config({path: path.join(__dirname, '.env')});

let jsonDownload = new Promise((resolve, reject) => {
    let area ='330000'
    let url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${area}.json`;
    let jsonData;

    let options = {json: true, encoding: 'utf-8'};

    request(url, options, (error, res, body) => {
        if (error) {
            return  console.log(error)
        };

        if (!error && res.statusCode === 200) {
            res = JSON.parse(body);
            jsonData = JSON.parse(body);
            //console.log(jsonData);
            fs.writeFileSync(`./${area}.json`, JSON.stringify(res, null, '    '));
        };
    });
    resolve(jsonData)
})

let databaseConnect = new Promise((resolve, reject) => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })

    client.connect()
    console.log('Database Connect.')

    resolve(client)
})


let areaName = jsonData[1]['timeSeries'][0]['areas']['area']['name']

console.log(`get area: ${areaName}`)

client.query(
    `
    CREATE TABLE "public".${areaName} (
    "id" serial,
    "publishing_office" text,
    "report_datetime" timestamp,
    "date_define" timestamp UNIQUE,
    "weather_code" text,
    "pops" text,
    "reliabilities" text,
    "tempsMin" text,
    "tempsMax" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
    );
    `
    , (err, res) => {
        console.log(err, res)
        client.end()
    })


