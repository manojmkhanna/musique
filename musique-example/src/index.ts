import * as musique from "musique";
import {AlbumOutput, SongOutput, SongParser} from "musique";
import * as Promise from "bluebird";
import * as readline from "readline";
import * as async from "async";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import * as ProgressBar from "progress";
import * as request from "request";
import * as ffmpeg from "fluent-ffmpeg";
import * as Jimp from "jimp";

const nodeID3v23 = require("node-id3");
const nodeID3v24 = require("node-id3v2.4");

function run(): Promise<void> {
    console.log("Starting...");
    console.log("");

    let songUrl: string,
        songFile: string,
        songParser: SongParser,
        songTitle: string,
        songTrack: string,
        songArtists: string,
        albumDate: string,
        albumLabel: string,
        albumLanguage: string,
        albumTitle: string,
        albumArtists: string,
        directory: string,
        mp3File: string,
        artFile: string;

    return new Promise<void>((resolve, reject) => {
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

            let songArgs: string[] = answer.split("; ");

            songUrl = songArgs[0];

            if (songArgs.length > 1) {
                songFile = songArgs[1];
            }

            rl.close();

            resolve();
        });
    })
        .then(() => {
            let platform: "deezer" | "saavn";

            if (songUrl.includes("deezer")) {
                platform = "deezer";
            } else if (songUrl.includes("saavn")) {
                platform = "saavn";
            }

            return new Promise<void>((resolve, reject) => {
                musique.parseSong(platform!, songUrl)
                    .then(parser => parser.parse())
                    .then(parser => parser.parseAlbum(childParser => childParser.parse()))
                    .then(parser => {
                        songParser = parser;

                        let songOutput: SongOutput = parser.output,
                            albumOutput: AlbumOutput = songOutput.album;

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
            return new Promise<void>(resolve => {
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
                    } else {
                        rl.close();

                        resolve();
                    }
                });
            });
        })
        .then(() => {
            directory = "Songs/"
                + albumLanguage + "/";

            if (albumLanguage === "English" && songTitle === albumTitle && songTrack === "1") {
                directory += "Singles/";
            }

            directory += albumDate.substr(0, 4) + "/"
                + albumTitle.replace(/\//g, "") + "/";
            directory = directory.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                mkdirp(directory, error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        })
        .then(() => {
            mp3File = directory + songTrack + " - " + songTitle + ".mp3";
            mp3File = mp3File.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                if (songFile) {
                    fs.rename(songFile, mp3File, error => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve();
                    });
                } else {
                    let progressBar: ProgressBar = new ProgressBar("Downloading... [:bar] :percent :speedMBps :sizeMB :etas", {
                        total: 100,
                        width: 10,
                        incomplete: " "
                    }), progress: any;

                    songParser.parseFile(downloadProgress => {
                        progressBar.update(downloadProgress.percent, {
                            speed: (downloadProgress.speed / 1024 / 1024).toFixed(1),
                            size: (downloadProgress.size.transferred / 1024 / 1024).toFixed(1)
                        });

                        progress = downloadProgress;
                    })
                        .then(parser => {
                            progressBar.update(1, {
                                speed: (0).toFixed(1),
                                size: (progress.size.total / 1024 / 1024).toFixed(1)
                            });

                            fs.writeFile(mp3File, parser.output.file, error => {
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
            return new Promise<void>((resolve, reject) => {
                ffmpeg.ffprobe(mp3File, (error, data) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (data.format.bit_rate >= 320000) {
                        resolve();
                        return;
                    }

                    let tmpFile: string = mp3File.replace(".mp3", ".tmp");

                    fs.rename(mp3File, tmpFile, error => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        let progressBar: ProgressBar = new ProgressBar("Converting... [:bar] :percent :sizeMB :etas", {
                            total: 100,
                            width: 10,
                            incomplete: " "
                        }), progress: any;

                        ffmpeg(tmpFile)
                            .audioBitrate("320k")
                            .on("progress", convertProgress => {
                                progressBar.update(convertProgress.percent / 100, {
                                    size: (convertProgress.targetSize / 1024).toFixed(1)
                                });

                                progress = convertProgress;
                            })
                            .on("error", error => {
                                reject(error);
                            })
                            .on("end", () => {
                                progressBar.update(1, {
                                    size: (progress.targetSize / 1024).toFixed(1)
                                });

                                fs.unlink(tmpFile, error => {
                                    if (error) {
                                        reject(error);
                                        return;
                                    }

                                    console.log("");

                                    resolve();
                                });
                            })
                            .save(mp3File);
                    });
                });
            });
        })
        .then(() => {
            artFile = directory + songTrack + " - " + songTitle + ".png";
            artFile = artFile.replace(/[\\:*?"<>|]/g, "");

            return new Promise<void>((resolve, reject) => {
                request(songParser.output.album.art)
                    .on("error", error => {
                        reject(error);
                    })
                    .pipe(fs.createWriteStream(artFile))
                    .on("finish", () => {
                        Jimp.read(artFile)
                            .then(image => {
                                image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                    .write(artFile, error => {
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
            return new Promise<void>((resolve, reject) => {
                nodeID3v23.removeTags(mp3File);

                nodeID3v23.write({
                    album: albumTitle,
                    artist: songArtists,
                    image: artFile,
                    language: albumLanguage,
                    performerInfo: albumArtists,
                    publisher: albumLabel,
                    title: songTitle,
                    trackNumber: songTrack
                }, mp3File);

                let tag = nodeID3v24.readTag(mp3File);
                tag.addFrame("TDRC", [albumDate]);
                tag.addFrame("TDRL", [albumDate]);
                tag.write();

                fs.unlink(artFile, error => {
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
