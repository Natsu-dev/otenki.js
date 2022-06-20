const Discord = require('discord.js');
const {getWeatherData} = require("../getWeatherData.js");
const {getSimpleLocalWeather} = require("../getWeatherData");
const fs = require("fs");
const path = require('path');

const openCodesFile = async () => new Promise((resolve, reject) => {
    fs.readFile(path.join('./areaCodes.json'), 'utf8', (err, file) => {
        resolve(JSON.parse(file));
    });

});

// 全国の天気
module.exports = {
    name: 'forecast',
    description: 'forecast',
    async execute(client, command, args, message) {

        console.log("f command: " + args.toString())
        // TODO: コード一覧を取得してから処理開始
        //  負荷を考えると起動時にグローバル変数に展開する方がかしこいのでは？
        openCodesFile().then(list => {

            let areaCodes = [];
            // 47都道府県について検索
            for (let pref of list) {
                // 各都道府県のaliasesに入力と同じものがあるか検証
                let place = pref.aliases.some(alias => alias === args[0])
                // あった場合はareaCodesにcodesの配列を渡してbreak
                if (place) {
                    console.log("place: " + place.toString())
                    areaCodes = pref.codes
                    break
                }
            }

            if (areaCodes) {
                // areaCodesの全要素について天気を取得し書き込み
                console.log(areaCodes)
                for (let code of areaCodes) {
                    getSimpleLocalWeather(code)
                        .then(resolve => {
                            console.log(resolve);
                            message.channel.send({embeds: [resolve]})
                                .then(r => console.log('Sent a forecast message.'));
                        })
                }
                // } else if (args[0]) {
                //     getSimpleLocalWeather(args[0])
                //         .then(resolve => {
                //             console.log(resolve);
                //             message.channel.send({embeds: [resolve]})
                //                 .then(r => console.log('Sent a forecast message.'));
                //         })
            } else {
                getWeatherData()
                    .then(resolve => {
                        console.log(resolve);
                        message.channel.send({embeds: [resolve]})
                            .then(r => console.log('Sent a forecast message.'));
                    })
            }
        })
    }
}