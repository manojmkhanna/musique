import * as musique from "musique";
import {AlbumOutput, SongOutput, SongParser} from "musique";
import * as readline from "readline";
import * as Promise from "bluebird";
import * as async from "async";
import * as mkdirp from "mkdirp";
// import * as ProgressBar from "progress";
import * as fs from "fs";
import * as request from "request";
import * as Jimp from "jimp";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const nodeID3v23 = require("node-id3");
const nodeID3v24 = require("node-id3v2.4");

function downloadSong(songUrl: string): Promise<void> {
    let platformName: "deezer" | "saavn";

    if (songUrl.includes("deezer")) {
        platformName = "deezer";
    } else if (songUrl.includes("saavn")) {
        platformName = "saavn";
    }

    let songParser: SongParser,
        songGenre: string,
        songTitle: string,
        songTrack: string,
        songArtists: string,
        albumDate: string,
        albumLabel: string,
        albumLanguage: string,
        albumTitle: string,
        albumYear: string,
        albumArtists: string,
        directoryName: string,
        songMp3FileName: string,
        songArtFileName: string;

    return new Promise<void>((resolve, reject) => {
        console.log("Starting download...");
        console.log("");

        musique.parseSong(platformName!, songUrl)
            .then(parser => parser.parse())
            .then(parser => parser.parseAlbum(childParser => childParser.parse()))
            .then(parser => {
                songParser = parser;

                let songOutput: SongOutput = parser.output,
                    albumOutput: AlbumOutput = songOutput.album;

                songGenre = songOutput.genre;
                songTitle = songOutput.title;
                songTrack = songOutput.track;
                songArtists = songOutput.artists.map(artist => artist.title).join("; ");
                albumDate = albumOutput.date;
                albumLabel = albumOutput.label;
                albumLanguage = albumOutput.language;
                albumTitle = albumOutput.title;
                albumYear = albumOutput.year;
                albumArtists = albumOutput.artists.map(artist => artist.title).join("; ");

                {   // TODO: Remove later
                    songArtists = songArtists.replace("A.R. Rahman", "A. R. Rahman");
                    albumArtists = albumArtists.replace("A.R. Rahman", "A. R. Rahman");
                }

                resolve();
            })
            .catch(error => {
                reject(error);
            });
    })
        .then(() => {
            return new Promise<void>(resolve => {
                async.series([
                    callback => {
                        rl.question("Song title: (" + songTitle + ") ", answer => {
                            if (answer) {
                                songTitle = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Album title: (" + albumTitle + ") ", answer => {
                            if (answer) {
                                albumTitle = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Song artists: (" + songArtists + ") ", answer => {
                            if (answer) {
                                songArtists = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Album artists: (" + albumArtists + ") ", answer => {
                            if (answer) {
                                albumArtists = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Song track: (" + songTrack + ") ", answer => {
                            if (answer) {
                                songTrack = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Song genre: (" + songGenre + ") ", answer => {
                            if (answer) {
                                songGenre = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Album label: (" + albumLabel + ") ", answer => {
                            if (answer) {
                                albumLabel = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Album language: (" + albumLanguage + ") ", answer => {
                            if (answer) {
                                albumLanguage = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Album date: (" + albumDate + ") ", answer => {
                            if (answer) {
                                albumDate = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Album year: (" + albumYear + ") ", answer => {
                            if (answer) {
                                albumYear = answer;
                            }

                            callback();
                        });
                    }
                ], () => {
                    rl.close();

                    console.log("");

                    resolve();
                });
            });
        })
        .then(() => {
            directoryName = "Songs/"
                + albumLanguage + "/"
                + albumYear + "/"
                + albumTitle + "/";
            directoryName = directoryName.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                mkdirp(directoryName, error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        })
        .then(() => {
            songMp3FileName = directoryName + songTrack + " - " + songTitle + ".mp3";
            songMp3FileName = songMp3FileName.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                // let progressBar: ProgressBar = new ProgressBar("Downloading... [:bar] :percent", {
                //     total: 100,
                //     width: 10,
                //     // complete: "=",
                //     // incomplete: " "
                // });

                songParser.parseFile(progress => {
                    // progressBar.tick(progress.percent, {});
                })
                    .then(parser => {
                        fs.writeFile(songMp3FileName, parser.output.file, error => {
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
        })
        .then(() => {
            songArtFileName = directoryName + songTrack + " - " + songTitle + ".png";
            songArtFileName = songArtFileName.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                request(songParser.output.album.art)
                    .on("error", error => {
                        reject(error);
                    })
                    .pipe(fs.createWriteStream(songArtFileName))
                    .on("finish", () => {
                        Jimp.read(songArtFileName)
                            .then(image => {
                                image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                    .write(songArtFileName, error => {
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
        })
        .then(() => {
            nodeID3v23.removeTags(songMp3FileName);

            nodeID3v23.write({
                album: albumTitle,
                artist: songArtists,
                genre: songGenre,
                image: songArtFileName,
                language: albumLanguage,
                performerInfo: albumArtists,
                publisher: albumLabel,
                title: songTitle,
                trackNumber: songTrack,
                year: albumYear,
            }, songMp3FileName);

            let tag = nodeID3v24.readTag(songMp3FileName);
            tag.addFrame("TDRL", [albumDate]);
            tag.write();
        })
        .then(() => {
            return new Promise<void>((resolve, reject) => {
                fs.unlink(songArtFileName, error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    console.log("Download completed!");

                    resolve();
                });
            });
        });
}

downloadSong(process.argv[2])
    .catch(error => {
        console.error(error);
    });
