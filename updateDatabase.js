const https = require("https");
const path = require("path");
const {Pool, Client} = require("pg");

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

updateDatabase = async primaryAreaCode => {
    downloadJson(primaryAreaCode).then((jsonData) => {
        let areaCode = jsonData[0].week.timeSeries[0].areas.area.code;
        let areaName = jsonData[0].name;
        let publishingOffice = jsonData[0].week.publishingOffice;
        let reportDatetime = jsonData[0].week.reportDatetime;
        let timeDefine = jsonData[0].week.timeSeries[0].timeDefines[0];
        let weatherCode = jsonData[0].week.timeSeries[0].areas.weatherCodes[0];
        let pop = jsonData[0].week.timeSeries[0].areas.pops[0];
        let reliability = jsonData[0].week.timeSeries[0].areas.reliabilities[0];
        let tempMin = jsonData[0].week.timeSeries[1].areas.tempsMin[0];
        let tempMinLower = jsonData[0].week.timeSeries[1].areas.tempsMinLower[0];
        let tempMinUpper = jsonData[0].week.timeSeries[1].areas.tempsMinUpper[0];
        let tempMax = jsonData[0].week.timeSeries[1].areas.tempsMax[0];
        let tempMaxLower = jsonData[0].week.timeSeries[1].areas.tempsMaxLower[0];
        let tempMaxUpper = jsonData[0].week.timeSeries[1].areas.tempsMaxUpper[0];

        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'user',
            port: 5432
        });

        const query = {
            text:`
                INSERT INTO tenki (area_code, area_name, publishing_office, report_datetime,
                                     time_define, weather_code, pop,
                                     reliability, temp_min, temp_min_lower,
                                     temp_min_upper, temp_max, temp_max_lower,
                                     temp_max_upper)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                ON CONFLICT (area_code, time_define)
                DO UPDATE SET (publishing_office=excluded.publishing_office,
                    report_datetime=excluded.report_datetime,
                    weather_code=excluded.weather_code,
                    pop=excluded.pop,
                    reliability=excluded.reliability,
                    temp_min=excluded.temp_min,
                    temp_min_lower=excluded.temp_min_lower,
                    temp_min_upper=excluded.temp_min_upper,
                    temp_max=excluded.temp_max,
                    temp_max_lower=excluded.temp_max_lower,
                    temp_max_upper=excluded.temp_max_upper);
            `,
            values: [areaCode, areaName, publishingOffice, reportDatetime,
                timeDefine, weatherCode, pop,
                reliability, tempMin, tempMinLower,
                tempMinUpper, tempMax, tempMaxLower,
                tempMaxUpper]
        }

        client.connect()
            .then(() => console.log('Successfully connected.'))
            .then(() => client.query(query))
            .then(res => console.log(res.rows[0]))
            .then(() => client.end())
            .catch(e => {
                console.log(e.stack);
                client.end();
            });

    })
}

updateDatabase('010000').then(() => console.log('success!!!!!!')).catch((res, err) => console.log(res, err))
