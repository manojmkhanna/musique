import * as musique from "musique";
import {AlbumOutput, SongOutput, SongParser} from "musique";
import * as Promise from "bluebird";
import * as readline from "readline";
import * as async from "async";
import * as mkdirp from "mkdirp";
import * as ProgressBar from "progress";
import * as fs from "fs";
import * as request from "request";
import * as Jimp from "jimp";
import * as program from "commander";

const nodeID3v23 = require("node-id3");
const nodeID3v24 = require("node-id3v2.4");

function downloadSong(url: string, edit: boolean): Promise<void> {
    let platformName: "deezer" | "saavn";

    if (url.includes("deezer")) {
        platformName = "deezer";
    } else if (url.includes("saavn")) {
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
        mp3FileName: string,
        artFileName: string;

    return new Promise<void>((resolve, reject) => {
        console.log("Starting...");
        console.log("");

        musique.parseSong(platformName!, url)
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
                if (edit) {
                    let rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

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
                } else {
                    console.log("Song title: " + songTitle);
                    console.log("Album title: " + albumTitle);
                    console.log("Song artists: " + songArtists);
                    console.log("Album artists: " + albumArtists);
                    console.log("Song track: " + songTrack);
                    console.log("Song genre: " + songGenre);
                    console.log("Album label: " + albumLabel);
                    console.log("Album language: " + albumLanguage);
                    console.log("Album date: " + albumDate);
                    console.log("Album year: " + albumYear);
                    console.log("");

                    resolve();
                }
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
            mp3FileName = directoryName + songTrack + " - " + songTitle + ".mp3";
            mp3FileName = mp3FileName.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                let progressBar: ProgressBar, newProgress: any;

                songParser.parseFile(progress => {
                    if (!progressBar) {
                        progressBar = new ProgressBar("Downloading... [:bar] :percent :speed :size :time", {
                            total: progress.size.total,
                            width: 10,
                            head: ">",
                            incomplete: " ",
                            renderThrottle: 250
                        });

                        newProgress = progress;
                        newProgress.size.downloaded = 0;
                    }

                    progressBar.tick(newProgress.size.transferred - newProgress.size.downloaded, {
                        speed: Math.round(newProgress.speed / 1024 / 1024 * 10) / 10 + "MBps",
                        size: Math.round(newProgress.size.transferred / 1024 / 1024 * 10) / 10 + "/"
                        + Math.round(newProgress.size.total / 1024 / 1024 * 10) / 10 + "MB",
                        time: Math.round(newProgress.time.remaining * 10) / 10 + "s"
                    });

                    newProgress.size.downloaded = newProgress.size.transferred;
                })
                    .then(parser => {
                        fs.writeFile(mp3FileName, parser.output.file, error => {
                            if (error) {
                                reject(error);
                                return;
                            }

                            progressBar.tick(newProgress.size.total, {
                                speed: Math.round(newProgress.speed / 1024 / 1024 * 10) / 10 + "MBps",
                                size: Math.round(newProgress.size.total / 1024 / 1024 * 10) / 10 + "/"
                                + Math.round(newProgress.size.total / 1024 / 1024 * 10) / 10 + "MB",
                                time: "0.0s"
                            });

                            resolve();
                        });
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        })
        .then(() => {
            artFileName = directoryName + songTrack + " - " + songTitle + ".png";
            artFileName = artFileName.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                request(songParser.output.album.art)
                    .on("error", error => {
                        reject(error);
                    })
                    .pipe(fs.createWriteStream(artFileName))
                    .on("finish", () => {
                        Jimp.read(artFileName)
                            .then(image => {
                                image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                    .write(artFileName, error => {
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
            nodeID3v23.removeTags(mp3FileName);

            nodeID3v23.write({
                album: albumTitle,
                artist: songArtists,
                genre: songGenre,
                image: artFileName,
                language: albumLanguage,
                performerInfo: albumArtists,
                publisher: albumLabel,
                title: songTitle,
                trackNumber: songTrack,
                year: albumYear,
            }, mp3FileName);

            let tag = nodeID3v24.readTag(mp3FileName);
            tag.addFrame("TDRL", [albumDate]);
            tag.write();
        })
        .then(() => {
            return new Promise<void>((resolve, reject) => {
                fs.unlink(artFileName, error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    console.log("");
                    console.log("Finished!");

                    resolve();
                });
            });
        });
}

program
    .option("-u, --url [url]")
    .option("-e, --edit")
    .parse(process.argv);

downloadSong(program.url, program.edit)
    .catch(error => {
        console.error(error);
    });
