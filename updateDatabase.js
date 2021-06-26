const https = require("https");
const path = require("path");
const {Client} = require("pg")

require('dotenv').config({path: path.join(__dirname, '.env')});

async function connectDatabase() {
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

async function downloadJson(areaCode) {
    const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
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

exports.updateDatabase = async function (areaCode) {
    const jsonData = await downloadJson(areaCode)
    const client = await connectDatabase()

    const query = {
        text: `
            INSERT INTO $1 (publishing_office, report_datetime, date_define, 
                            weather_code, pop, reliability, temp_min, 
                            temp_min_lower, temp_min_upper, temp_max, 
                            temp_max_lower, temp_max_upper)
            VALUES ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `,
        values: [areaCode, publishingOffice, reportDatetime,
            dateDefine, weatherCode, pop,
            reliability, tempMin, tempMinLower,
            tempMinUpper, tempMax, tempMaxLower,
            tempMaxUpper]
    }

}
