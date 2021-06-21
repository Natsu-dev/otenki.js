const fs = require('fs')
const https = require("https");

let area ='330000'

let url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${area}.json`;
https.get(url, (res) => {
    let body = '';
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', (res) => {
        res = JSON.parse(body);
        console.log(res);
        fs.writeFileSync(`./${area}.json`, JSON.stringify(res, null, '    '));
    });
}).on('error', (e) => {
    console.log(e.message); //エラー時
});

console.log(`get area: ${area}`)
