"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const musique = require("musique");
const Promise = require("bluebird");
const readline = require("readline");
const async = require("async");
const mkdirp = require("mkdirp");
const fs = require("fs");
const ProgressBar = require("progress");
const request = require("request");
const ffmpeg = require("fluent-ffmpeg");
const Jimp = require("jimp");
const nodeID3v23 = require("node-id3");
const nodeID3v24 = require("node-id3v2.4");
function run() {
    console.log("Starting...");
    console.log("");
    let songUrl, songFileName, songParser, songTitle, songTrack, songArtists, albumDate, albumLabel, albumLanguage, albumTitle, albumArtists, directoryName, mp3FileName, artFileName;
    return new Promise((resolve, reject) => {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Song args: ", answer => {
            console.log("");
            if (!answer) {
                rl.close();
                reject(new Error("Invalid song args!"));
                return;
            }
            let songArgs = answer.split("; ");
            songUrl = songArgs[0];
            if (songArgs.length > 1) {
                songFileName = songArgs[1];
            }
            rl.close();
            resolve();
        });
    })
        .then(() => {
        let platformName;
        if (songUrl.includes("deezer")) {
            platformName = "deezer";
        }
        else if (songUrl.includes("saavn")) {
            platformName = "saavn";
        }
        return new Promise((resolve, reject) => {
            musique.parseSong(platformName, songUrl)
                .then(parser => parser.parse())
                .then(parser => parser.parseAlbum(childParser => childParser.parse()))
                .then(parser => {
                songParser = parser;
                let songOutput = parser.output, albumOutput = songOutput.album;
                songTitle = songOutput.title;
                songTrack = songOutput.track;
                songArtists = [...new Set(songOutput.artists.map(artist => artist.title))].join("; ");
                albumDate = albumOutput.date;
                albumLabel = albumOutput.label;
                albumLanguage = albumOutput.language;
                albumTitle = albumOutput.title;
                albumArtists = [...new Set(albumOutput.artists.map(artist => artist.title))].join("; ");
                songArtists = songArtists.replace(/\.(\w)/g, ". $1");
                albumArtists = albumArtists.replace(/\.(\w)/g, ". $1");
                resolve();
            })
                .catch(error => {
                reject(error);
            });
        });
    })
        .then(() => {
        return new Promise(resolve => {
            console.log("Song title: " + songTitle);
            console.log("Album title: " + albumTitle);
            console.log("Song artists: " + songArtists);
            console.log("Album artists: " + albumArtists);
            console.log("Song track: " + songTrack);
            console.log("Album date: " + albumDate);
            console.log("Album label: " + albumLabel);
            console.log("Album language: " + albumLanguage);
            console.log("");
            let rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question("Update? (no) ", answer => {
                console.log("");
                if (answer === "y" || answer === "yes") {
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
                            rl.question("Album date: (" + albumDate + ") ", answer => {
                                if (answer) {
                                    albumDate = answer;
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
                        }
                    ], () => {
                        console.log("");
                        rl.close();
                        resolve();
                    });
                }
                else {
                    rl.close();
                    resolve();
                }
            });
        });
    })
        .then(() => {
        directoryName = "Songs/"
            + albumLanguage + "/";
        if (albumLanguage === "English" && songTitle === albumTitle && songTrack === "1") {
            directoryName += "Singles/";
        }
        directoryName += albumDate.substr(0, 4) + "/"
            + albumTitle + "/";
        directoryName = directoryName.replace(/[\\:*?"<>|]/g, "");
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
            if (songFileName) {
                fs.rename(songFileName, mp3FileName, error => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            }
            else {
                let progressBar = new ProgressBar("Downloading... [:bar] :percent :speedMBps :sizeMB :etas", {
                    total: 100,
                    width: 10,
                    incomplete: " "
                }), progress;
                songParser.parseFile(downloadProgress => {
                    progressBar.update(downloadProgress.percent, {
                        speed: Math.round(downloadProgress.speed / 1024 / 1024 * 10) / 10,
                        size: Math.round(downloadProgress.size.transferred / 1024 / 1024 * 10) / 10
                    });
                    progress = downloadProgress;
                })
                    .then(parser => {
                    progressBar.update(1, {
                        speed: Math.round(progress.speed / 1024 / 1024 * 10) / 10,
                        size: Math.round(progress.size.total / 1024 / 1024 * 10) / 10
                    });
                    fs.writeFile(mp3FileName, parser.output.file, error => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        console.log("");
                        resolve();
                    });
                })
                    .catch(error => {
                    reject(error);
                });
            }
        });
    })
        .then(() => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(mp3FileName, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (data.format.bit_rate >= 320000) {
                    resolve();
                    return;
                }
                let tmpFileName = mp3FileName.replace(".mp3", ".tmp");
                fs.rename(mp3FileName, tmpFileName, error => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    let progressBar = new ProgressBar("Converting... [:bar] :percent :sizeMB :etas", {
                        total: 100,
                        width: 10,
                        incomplete: " "
                    }), progress;
                    ffmpeg(tmpFileName)
                        .audioBitrate("320k")
                        .on("progress", convertProgress => {
                        progressBar.update(convertProgress.percent / 100, {
                            size: Math.round(convertProgress.targetSize / 1024 * 10) / 10
                        });
                        progress = convertProgress;
                    })
                        .on("error", error => {
                        reject(error);
                    })
                        .on("end", () => {
                        progressBar.update(1, {
                            size: Math.round(progress.targetSize / 1024 * 10) / 10
                        });
                        fs.unlink(tmpFileName, error => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            console.log("");
                            resolve();
                        });
                    })
                        .save(mp3FileName);
                });
            });
        });
    })
        .then(() => {
        artFileName = directoryName + songTrack + " - " + songTitle + ".png";
        artFileName = artFileName.replace(/[\\:*?"<>|]/g, "");
        return new Promise((resolve, reject) => {
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
        return new Promise((resolve, reject) => {
            nodeID3v23.removeTags(mp3FileName);
            nodeID3v23.write({
                album: albumTitle,
                artist: songArtists,
                image: artFileName,
                language: albumLanguage,
                performerInfo: albumArtists,
                publisher: albumLabel,
                title: songTitle,
                trackNumber: songTrack
            }, mp3FileName);
            let tag = nodeID3v24.readTag(mp3FileName);
            tag.addFrame("TDRC", [albumDate]);
            tag.addFrame("TDRL", [albumDate]);
            tag.write();
            fs.unlink(artFileName, error => {
                if (error) {
                    reject(error);
                    return;
                }
                console.log("Completed!");
                resolve();
            });
        });
    });
}
run()
    .catch(error => {
    console.error(error);
});

//# sourceMappingURL=index.js.map
