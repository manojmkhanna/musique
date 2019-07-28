import * as async from "async";
import * as Promise from "bluebird";
import * as fs from "fs";
import * as musique from "musique";

const PROVIDER_NAME: any = "deezer";
const SONG_URL: string = "https://www.deezer.com/en/track/698905582";
const ALBUM_URL: string = "https://www.deezer.com/en/album/100856872";
const ARTIST_URL: string = "https://www.deezer.com/en/artist/5962948";
const PLAYLIST_URL: string = "https://www.deezer.com/en/playlist/1111142221";
const SEARCH_QUERY: string = "senorita";

// const PROVIDER_NAME: any = "saavn";
// const SONG_URL: string = "https://www.jiosaavn.com/song/bekhayali/PxwgWUFzBwU";
// const ALBUM_URL: string = "https://www.jiosaavn.com/album/kabir-singh/kLG-OKbVmvM_";
// const ARTIST_URL: string = "https://www.jiosaavn.com/artist/sachet-tandon-songs/wVwhaAx3x6c_";
// const PLAYLIST_URL: string = "https://www.jiosaavn.com/featured/weekly-top-15-hindi/8MT-LQlP35c_";
// const SEARCH_QUERY: string = "bekhayali";

async.series([
    callback => {
        musique.parseSong(PROVIDER_NAME, SONG_URL)
            .then(parser => parser.parse())
            .then(parser => parser.parseFile(() => {
            }))
            .then(parser => new Promise<any>((resolve, reject) => {
                fs.writeFile("Song.mp3", parser.output.file, error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    parser.output.file = undefined;

                    resolve(parser);
                });
            }))
            .then(parser => {
                console.log(JSON.stringify(parser.output, null, 4));
                console.log("");

                callback();
            })
            .catch(error => {
                callback(error);
            });
    },
    callback => {
        musique.parseAlbum(PROVIDER_NAME, ALBUM_URL)
            .then(parser => parser.parse())
            .then(parser => {
                console.log(JSON.stringify(parser.output, null, 4));
                console.log("");

                callback();
            })
            .catch(error => {
                callback(error);
            });
    },
    callback => {
        musique.parseArtist(PROVIDER_NAME, ARTIST_URL)
            .then(parser => parser.parse())
            .then(parser => {
                console.log(JSON.stringify(parser.output, null, 4));
                console.log("");

                callback();
            })
            .catch(error => {
                callback(error);
            });
    },
    callback => {
        musique.parsePlaylist(PROVIDER_NAME, PLAYLIST_URL)
            .then(parser => parser.parse())
            .then(parser => {
                console.log(JSON.stringify(parser.output, null, 4));
                console.log("");

                callback();
            })
            .catch(error => {
                callback(error);
            });
    },
    callback => {
        musique.parseSearch(PROVIDER_NAME, SEARCH_QUERY)
            .then(parser => parser.parse())
            .then(parser => {
                console.log(JSON.stringify(parser.output, null, 4));

                callback();
            })
            .catch(error => {
                callback(error);
            });
    }
], error => {
    if (error) {
        console.error(error);
    }
});
