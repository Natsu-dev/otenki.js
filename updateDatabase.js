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

exports.updateDatabase = async function (primaryAreaCode) {
    const jsonData = await downloadJson(primaryAreaCode)
    let areaCode, areaName, publishingOffice,
        reportDatetime, timeDefine, weatherCode,
        pop, reliability, tempMin,
        tempMinLower, tempMinUpper, tempMax,
        tempMaxLower, tempMaxUpper;

    areaCode = jsonData[0].week.timeSeries[0].areas.area.code;
    areaName = jsonData[0].week.timeSeries[0].areas.area.name;
    publishingOffice = jsonData[0].week.publishingOffice;
    reportDatetime = jsonData[0].week.reportDatetime;
    timeDefine = jsonData[0].week.timeSeries[0].timeDefines[0];
    weatherCode = jsonData[0].week.timeSeries[0].areas.weatherCodes[0];
    pop = jsonData.week.timeSeries[0].areas.pops[0];
    reliability = jsonData.week.timeSeries[0].areas.reliabilities[0];
    tempMin = jsonData.week.timeSeries[1].areas.tempsMin[0];
    tempMinLower = jsonData.week.timeSeries[1].areas.tempsMinLower[0];
    tempMinUpper = jsonData.week.timeSeries[1].areas.tempsMinUpper[0];
    tempMax = jsonData.week.timeSeries[1].areas.tempsMax[0];
    tempMaxLower = jsonData.week.timeSeries[1].areas.tempsMaxLower[0];
    tempMaxUpper = jsonData.week.timeSeries[1].areas.tempsMaxUpper[0];

    const client = await connectDatabase()
    await client.connect()

    console.log(areaCode, areaName)

    const query = {
        text: `
            INSERT INTO 'tenki' (area_code, area_name, publishing_office, report_datetime,
                                 time_define, weather_code, pop,
                                 reliability, temp_min, temp_min_lower,
                                 temp_min_upper, temp_max, temp_max_lower,
                                 temp_max_upper)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT ON CONSTRAINT (area_code, time_define)
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
    //client.query(query)
    //    .then(res => console.log(res.rows[0]))
    //    .catch(e => console.log(e.stack))
}
