import * as Promise from "bluebird";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import * as request from "request";
import * as Jimp from "jimp";
import * as musique from "musique";

const nodeID3 = require("node-id3");

function downloadMp3(songOutput: any, albumOutput: any): Promise<void> {
    let dirName: string, mp3Name: string, artName: string;

    return new Promise<void>((resolve, reject) => {
        dirName = "./Songs/"
            + albumOutput.language + "/"
            + albumOutput.year + "/"
            + albumOutput.title + "/";
        dirName = dirName.replace(/[\\:*?"<>|]/g, "");

        mkdirp(dirName, error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    }).then(() => {
        mp3Name = dirName + songOutput.title + ".mp3";
        mp3Name = mp3Name.replace(/[\\:*?"<>|]/g, "");

        return new Promise<void>((resolve, reject) => {
            request.get(songOutput.mp3)
                .on("error", error => {
                    reject(error);
                })
                .pipe(fs.createWriteStream(mp3Name))
                .on("finish", () => {
                    resolve();
                });
        });
    }).then(() => {
        artName = dirName + songOutput.title + ".png";
        artName = artName.replace(/[\\:*?"<>|]/g, "");

        return new Promise<void>((resolve, reject) => {
            request.get(albumOutput.art)
                .on("error", error => {
                    reject(error);
                })
                .pipe(fs.createWriteStream(artName))
                .on("finish", () => {
                    Jimp.read(artName)
                        .then(image => {
                            image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                .write(artName, error => {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }

                                    resolve();
                                });
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
        });
    }).then(() => {
        nodeID3.removeTags(mp3Name);

        nodeID3.write({
            album: albumOutput.title,
            artist: songOutput.artists.map((artist: any) => artist.title).join("; "),
            genre: songOutput.genre,
            image: artName,
            language: albumOutput.language,
            performerInfo: albumOutput.artists.map((artist: any) => artist.title).join("; "),
            publisher: albumOutput.label,
            title: songOutput.title,
            trackNumber: songOutput.track,
            year: albumOutput.year,
        }, mp3Name)

        //TODO
    }).then(() => {
        return new Promise<void>((resolve, reject) => {
            fs.unlink(artName, error => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    });
}

musique.parseSong("saavn", "https://www.saavn.com/s/song/tamil/Mersal/Neethanae/MiIPaAFCBlc")
    .then(parser => parser.parse())
    .then(parser => parser.parseAlbum(childParser => childParser.parse()))
    .then(parser => downloadMp3(parser.output, parser.output.album))
    .catch(error => {
        console.error(error);
    });
