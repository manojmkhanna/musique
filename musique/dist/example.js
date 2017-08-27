"use strict";
//TODO: Remove this file and change package.json later
Object.defineProperty(exports, "__esModule", { value: true });
const musique = require("./index");
let startTime = new Date().getTime();
// musique.parseSong("saavn", "https://www.saavn.com/s/song/hindi/Baadshaho/Mere-Rashke-Qamar/BiVdYgRTdms")
//     .then(parser => parser.parse())
//     .then(parser => {
//         console.log(JSON.stringify(parser.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });
// musique.parseAlbum("saavn", "https://www.saavn.com/s/album/hindi/Baadshaho-2017/dDM81KaRr18_")
//     .then(parser => parser.parse())
//     .then(parser => {
//         console.log(JSON.stringify(parser.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });
// musique.parseArtist("saavn", "https://www.saavn.com/s/artist/arijit-singh-artist/LlRWpHzy3Hk_")
//     .then(parser => parser.parse())
//     .then(parser => {
//         console.log(JSON.stringify(parser.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });
// musique.parsePlaylist("saavn", "https://www.saavn.com/s/playlist/cc247fcfabb27a5510270b9f7753062b/Starred_Songs/18CVwm1Pnxw_")
//     .then(parser => parser.parse())
//     .then(parser => {
//         console.log(JSON.stringify(parser.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });
// musique.parseSearch("saavn", "one")
//     .then(parser => parser.parse())
//     .then(parser => {
//         console.log(JSON.stringify(parser.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });
// musique.parseSong("deezer", "http://www.deezer.com/en/track/375660351")
//     .then(parser => parser.parse())
//     .then(parser => {
//         console.log(JSON.stringify(parser.output, null, 2));
//         console.log("");
//         console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
//     })
//     .catch(error => {
//         console.error(error);
//     });
musique.parseAlbum("deezer", "http://www.deezer.com/en/album/43480531")
    .then(parser => parser.parse())
    .then(parser => {
    console.log(JSON.stringify(parser.output, null, 2));
    console.log("");
    console.log("Run time: " + (new Date().getTime() - startTime) / 1000 + "s");
})
    .catch(error => {
    console.error(error);
});

//# sourceMappingURL=example.js.map
