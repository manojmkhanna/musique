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
                let downloadProgress, downloadProgressBar;
                let megaBytes = function (bytes) {
                    return Math.round(bytes / 1024 / 1024 * 10) / 10;
                };
                songParser.parseFile(progress => {
                    if (!downloadProgress) {
                        downloadProgress = progress;
                        downloadProgress.size.downloaded = 0;
                        downloadProgressBar = new ProgressBar("Downloading... [:bar] :percent :speed :size :time", {
                            total: downloadProgress.size.total,
                            width: 10,
                            head: ">",
                            incomplete: " ",
                            renderThrottle: 100
                        });
                    }
                    downloadProgressBar.tick(downloadProgress.size.transferred - downloadProgress.size.downloaded, {
                        speed: megaBytes(downloadProgress.speed) + "MBps",
                        size: megaBytes(downloadProgress.size.transferred) + "/" + megaBytes(downloadProgress.size.total) + "MB",
                        time: downloadProgress.time.remaining + "s"
                    });
                    downloadProgress.size.downloaded = downloadProgress.size.transferred;
                })
                    .then(parser => {
                    fs.writeFile(mp3FileName, parser.output.file, error => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        downloadProgressBar.tick(downloadProgress.size.total, {
                            speed: megaBytes(downloadProgress.speed) + "MBps",
                            size: megaBytes(downloadProgress.size.total) + "/" + megaBytes(downloadProgress.size.total) + "MB",
                            time: "0s"
                        });
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
                    ffmpeg(tmpFileName)
                        .audioBitrate("320k")
                        .on("error", error => {
                        reject(error);
                    })
                        .on("end", () => {
                        fs.unlink(tmpFileName, error => {
                            if (error) {
                                reject(error);
                                return;
                            }
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
