const fs = require('fs')
const https = require("https");

let url = 'https://www.jma.go.jp/bosai/common/const/area.json';
https.get(url, (res) => {
    let body = '';
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', (res) => {
        res = JSON.parse(body);
        console.log(res);
        fs.writeFileSync('./areaCodes.json', JSON.stringify(res, null, '    '));
    });
}).on('error', (e) => {
    console.log(e.message); //エラー時
});
