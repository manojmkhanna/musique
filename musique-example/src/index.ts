import * as musique from "musique";
import * as fs from "fs";

musique.parseSong("saavn", "https://www.saavn.com/s/song/tamil/Mersal/Neethanae/MiIPaAFCBlc")
    .then(parser => parser.parse())
    .then(parser => parser.parseFile())
    .then(parser => parser.parseAlbum(childParser => childParser.parse()))
    .then(parser => {
        console.log(parser.output);
        // console.log(JSON.stringify(parser.output, null, 2));

        fs.writeFileSync("song.mp3", parser.output.file);
    })
    .catch(error => {
        console.error(error);
    });
