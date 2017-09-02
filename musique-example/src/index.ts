import * as musique from "musique";
import * as fs from "fs";

musique.parseSong("saavn", "https://www.saavn.com/s/song/tamil/Mersal/Neethanae/MiIPaAFCBlc")
// musique.parseSong("deezer", "http://www.deezer.com/en/track/375660351")
    .then(parser => parser.parse())
    .then(parser => parser.parseFile((progress: object) => {
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
