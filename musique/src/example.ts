//TODO: Remove this file and change package.json later

import * as musique from "./index";

let startTime = new Date().getTime();

// musique.parseSong("saavn", "https://www.saavn.com/s/song/hindi/Baadshaho/Mere-Rashke-Qamar/BiVdYgRTdms")
//     .then(value => value.parse())
//     .then(value => {
//         console.log(JSON.stringify(value.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });

musique.parseAlbum("saavn", "https://www.saavn.com/s/album/hindi/Baadshaho-2017/dDM81KaRr18_")
    .then(value => value.parse())
    .then(value => {
        console.log(JSON.stringify(value.output, null, 2));
        console.log("");
        console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
    })
    .catch(error => {
        console.error(error);
    });
