"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const musique = require("musique");
const mkdirp = require("mkdirp");
const fs = require("fs");
// import * as http from "http";
// import * as request from "request-promise";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
musique.parseSong("saavn", "https://www.saavn.com/s/song/tamil/Mersal/Neethanae/MiIPaAFCBlc")
    .then(parser => parser.parse())
    .then(parser => parser.parseAlbum(childParser => childParser.parse()))
    .then(parser => {
    let songOutput = parser.output;
    let albumOutput = songOutput.album;
    rl.question("", answer => {
    });
    let dirName = "./Songs/"
        + albumOutput.language + "/"
        + albumOutput.year + "/"
        + albumOutput.title + "/";
    dirName = dirName.replace(/[\\:*?"<>|]/g, "");
    mkdirp.sync(dirName);
    let fileName = dirName + songOutput.title + ".mp3";
    fileName = fileName.replace(/[\\:*?"<>|]/g, "");
    let stream = fs.createWriteStream(fileName);
    // http.get(songOutput.mp3.replace("https", "http"), res => {
    //     res.pipe(stream)
    //         .on("finish", () => {
    //
    //         });
    // }).on("error", error => {
    //     console.error(error);
    // })
})
    .catch(error => {
    console.error(error);
});

//# sourceMappingURL=index.js.map
