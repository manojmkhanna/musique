"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const musique = require("musique");
const fs = require("fs");
musique.parseSong("saavn", "https://www.saavn.com/s/song/tamil/Mersal/Neethanae/MiIPaAFCBlc")
    .then(parser => parser.parse())
    .then(parser => parser.parseFile((progress) => {
    console.log(progress);
}))
    .then(parser => parser.parseAlbum(childParser => childParser.parse()))
    .then(parser => {
    console.log(parser.output);
    // console.log(JSON.stringify(parser.output, null, 2));
    fs.writeFileSync("song.mp3", parser.output.file);
})
    .catch(error => {
    console.error(error);
});

//# sourceMappingURL=index.js.map
