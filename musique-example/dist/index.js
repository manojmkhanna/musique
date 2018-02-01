"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const musique = require("musique");
const async = require("async");
const program = require("commander");
const ffmpeg = require("fluent-ffmpeg");
const Jimp = require("jimp");
const mkdirp = require("mkdirp");
const ProgressBar = require("progress");
const request = require("request");
const fs = require("fs");
const readline = require("readline");
const nodeID3v23 = require("node-id3");
const nodeID3v24 = require("node-id3v2.4");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
class Album {
}
class Song {
}
program
    .command("song")
    .action(() => {
    console.log("Musique");
    console.log("");
    let songUrl, songFile;
    let album, song;
    async.series([
        callback => {
            async.series([
                callback => {
                    rl.question("Song url: ", answer => {
                        if (answer) {
                            songUrl = answer;
                        }
                        callback();
                    });
                }, callback => {
                    rl.question("Song file: ", answer => {
                        console.log("");
                        if (answer) {
                            songFile = answer;
                        }
                        callback();
                    });
                }, callback => {
                    if (!songUrl && !songFile) {
                        callback(new Error());
                        return;
                    }
                    callback();
                }
            ], error => {
                callback(error);
            });
        }, callback => {
            if (songUrl) {
                console.log("Parsing song...");
                let platform;
                if (songUrl.includes("deezer")) {
                    platform = "deezer";
                }
                else if (songUrl.includes("saavn")) {
                    platform = "saavn";
                }
                let albumParser;
                musique.parseSong(platform, songUrl)
                    .then(parser => parser.parse())
                    .then(parser => parser.parseAlbum(childParser => {
                    albumParser = childParser;
                    console.log("Parsing album...");
                    console.log("");
                    return childParser.parse();
                }))
                    .then(parser => {
                    let songOutput = parser.output, albumOutput = songOutput.album;
                    album = new Album();
                    album.parser = albumParser;
                    album.date = albumOutput.date;
                    album.label = albumOutput.label;
                    album.language = albumOutput.language;
                    album.title = albumOutput.title;
                    album.artists = [...new Set(albumOutput.artists
                            .map(value => value.title))].join("; ").replace(/\.(\w)/g, ". $1");
                    song = new Song();
                    song.parser = parser;
                    song.title = songOutput.title;
                    song.track = songOutput.track;
                    song.artists = [...new Set(songOutput.artists
                            .map(value => value.title))].join("; ").replace(/\.(\w)/g, ". $1");
                    if (songFile) {
                        song.file = songFile;
                    }
                    callback();
                })
                    .catch(error => {
                    callback(error);
                });
            }
            else if (songFile) {
                let tagMap = new Map();
                for (let frame of nodeID3v24.readTag(songFile).frames) {
                    tagMap.set(frame.type, frame.data);
                }
                album = new Album();
                album.date = tagMap.get("TDRL").text.replace("\u0000", "");
                album.label = tagMap.get("TPUB").text;
                album.language = tagMap.get("TLAN").text;
                album.title = tagMap.get("TALB").text;
                album.artists = tagMap.get("TPE2").text;
                song = new Song();
                song.title = tagMap.get("TIT2").text;
                song.track = tagMap.get("TRCK").text;
                song.artists = tagMap.get("TPE1").text;
                song.file = songFile;
                if (tagMap.has("APIC")) {
                    album.art = songFile.replace(".mp3", ".png");
                    fs.writeFile(album.art, tagMap.get("APIC").picture, error => {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback();
                    });
                }
                else {
                    callback();
                }
            }
        }, callback => {
            console.log("Updating album...");
            console.log("Album title: " + album.title);
            console.log("Album artists: " + album.artists);
            console.log("Album date: " + album.date);
            console.log("Album label: " + album.label);
            console.log("Album language: " + album.language);
            rl.question("Update album? (no) ", answer => {
                console.log("");
                if (answer === "y" || answer === "yes") {
                    async.series([
                        callback => {
                            rl.question("Album title: (" + album.title + ") ", answer => {
                                if (answer) {
                                    album.title = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album artists: (" + album.artists + ") ", answer => {
                                if (answer) {
                                    album.artists = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album date: (" + album.date + ") ", answer => {
                                if (answer) {
                                    album.date = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album label: (" + album.label + ") ", answer => {
                                if (answer) {
                                    album.label = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album language: (" + album.language + ") ", answer => {
                                console.log("");
                                if (answer) {
                                    album.language = answer;
                                }
                                callback();
                            });
                        }
                    ], () => {
                        callback();
                    });
                }
                else {
                    callback();
                }
            });
        }, callback => {
            console.log("Updating song...");
            console.log("Song track: " + song.track);
            console.log("Song title: " + song.title);
            console.log("Song artists: " + song.artists);
            rl.question("Update song? (no) ", answer => {
                console.log("");
                if (answer === "y" || answer === "yes") {
                    async.series([
                        callback => {
                            rl.question("Song track: (" + song.track + ") ", answer => {
                                if (answer) {
                                    song.track = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Song title: (" + song.title + ") ", answer => {
                                if (answer) {
                                    song.title = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Song artists: (" + song.artists + ") ", answer => {
                                console.log("");
                                if (answer) {
                                    song.artists = answer;
                                }
                                callback();
                            });
                        }
                    ], () => {
                        callback();
                    });
                }
                else {
                    callback();
                }
            });
        }, callback => {
            album.folder = "Songs/" + album.language + "/";
            if (album.language === "English" && song.title === album.title && song.track === "1") {
                album.folder += "Singles/";
            }
            album.folder += album.date.substr(0, 4) + "/" + album.title.replace(/\//g, "") + "/";
            album.folder = album.folder.replace(/[\\:*?"<>|]/g, "");
            mkdirp(album.folder, error => {
                if (error) {
                    callback(error);
                    return;
                }
                callback();
            });
        }, callback => {
            let songFile;
            if (song.file) {
                songFile = song.file;
            }
            song.file = album.folder + song.track + " - " + song.title + ".mp3";
            song.file = song.file.replace(/[\\:*?"<>|]/g, "");
            if (!songFile) {
                let progressBar = new ProgressBar("Downloading song"
                    + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                    total: 100,
                    width: 10,
                    incomplete: " "
                }), progress;
                song.parser.parseFile(downloadProgress => {
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
                    console.log("");
                    fs.writeFile(song.file, parser.output.file, error => {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback();
                    });
                })
                    .catch(error => {
                    callback(error);
                });
            }
            else {
                fs.rename(songFile, song.file, error => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback();
                });
            }
        }, callback => {
            ffmpeg.ffprobe(song.file, (error, data) => {
                if (error) {
                    callback(error);
                    return;
                }
                if (data.format.bit_rate >= 320000) {
                    callback();
                    return;
                }
                let tempSongFile = song.file.replace(".mp3", ".tmp");
                fs.rename(song.file, tempSongFile, error => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    let progressBar = new ProgressBar("Converting song"
                        + "... [:bar] :percent :sizeMB :etas", {
                        total: 100,
                        width: 10,
                        incomplete: " "
                    }), progress;
                    ffmpeg(tempSongFile)
                        .audioBitrate("320k")
                        .on("progress", convertProgress => {
                        progressBar.update(convertProgress.percent / 100, {
                            size: (convertProgress.targetSize / 1024).toFixed(1)
                        });
                        progress = convertProgress;
                    })
                        .on("error", error => {
                        callback(error);
                    })
                        .on("end", () => {
                        progressBar.update(1, {
                            size: (progress.targetSize / 1024).toFixed(1)
                        });
                        fs.unlink(tempSongFile, error => {
                            if (error) {
                                callback(error);
                                return;
                            }
                            console.log("");
                            callback();
                        });
                    })
                        .save(song.file);
                });
            });
        }, callback => {
            let albumArt;
            if (album.art) {
                albumArt = album.art;
            }
            album.art = album.folder + song.track + " - " + song.title + ".png";
            album.art = album.art.replace(/[\\:*?"<>|]/g, "");
            if (!albumArt) {
                request(album.parser.output.art)
                    .on("error", error => {
                    callback(error);
                })
                    .pipe(fs.createWriteStream(album.art))
                    .on("finish", () => {
                    Jimp.read(album.art)
                        .then(image => {
                        image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                            .write(album.art, error => {
                            if (error) {
                                callback(error);
                                return;
                            }
                            callback();
                        });
                    })
                        .catch(error => {
                        callback(error);
                    });
                });
            }
            else {
                fs.rename(albumArt, album.art, error => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback();
                });
            }
        }, callback => {
            nodeID3v23.removeTags(song.file);
            nodeID3v23.write({
                album: album.title,
                artist: song.artists,
                image: album.art,
                language: album.language,
                performerInfo: album.artists,
                publisher: album.label,
                title: song.title,
                trackNumber: song.track
            }, song.file);
            let tag = nodeID3v24.readTag(song.file, {
                targetversion: 4
            });
            tag.addFrame("TDRC", [album.date]);
            tag.addFrame("TDRL", [album.date]);
            tag.write();
            fs.unlink(album.art, error => {
                if (error) {
                    callback(error);
                    return;
                }
                console.log("Completed!");
                callback();
            });
        }
    ], error => {
        rl.close();
        if (error) {
            console.error(error);
        }
    });
});
program
    .command("album")
    .action(() => {
    console.log("Musique");
    console.log("");
    let albumUrl, albumFolder, songTracks;
    let songFileMap = new Map();
    let album, songs = [];
    async.series([
        callback => {
            async.series([
                callback => {
                    rl.question("Album url: ", answer => {
                        if (answer) {
                            albumUrl = answer;
                        }
                        callback();
                    });
                }, callback => {
                    rl.question("Album folder: ", answer => {
                        if (answer) {
                            albumFolder = answer;
                        }
                        callback();
                    });
                }, callback => {
                    rl.question("Song tracks: ", answer => {
                        console.log("");
                        if (answer) {
                            songTracks = answer;
                        }
                        callback();
                    });
                }, callback => {
                    if (!albumUrl && !albumFolder || albumUrl && !songTracks) {
                        callback(new Error());
                        return;
                    }
                    callback();
                }
            ], error => {
                callback(error);
            });
        }, callback => {
            if (albumFolder) {
                fs.readdir(albumFolder, (error, files) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    for (let file of files.filter(value => value.endsWith(".mp3"))) {
                        songFileMap.set(parseInt(file.match(/(\d+) - /)[1]) - 1, file);
                    }
                    callback();
                });
            }
        }, callback => {
            if (albumUrl) {
                console.log("Parsing album...");
                let songIndexes = [...new Set(songTracks.split(", ")
                        .map(value => parseInt(value) - 1))].sort();
                let platform;
                if (albumUrl.includes("deezer")) {
                    platform = "deezer";
                }
                else if (albumUrl.includes("saavn")) {
                    platform = "saavn";
                }
                let songParserMap = new Map();
                musique.parseAlbum(platform, albumUrl)
                    .then(parser => parser.parse())
                    .then(parser => parser.parseSongs((childParser, index) => {
                    songParserMap.set(index, childParser);
                    console.log("Parsing song " + (index + 1) + "...");
                    return childParser.parse();
                }, ...songIndexes))
                    .then(parser => {
                    console.log("");
                    let albumOutput = parser.output;
                    album = new Album();
                    album.parser = parser;
                    album.date = albumOutput.date;
                    album.label = albumOutput.label;
                    album.language = albumOutput.language;
                    album.title = albumOutput.title;
                    album.artists = [...new Set(albumOutput.artists
                            .map(value => value.title))].join("; ").replace(/\.(\w)/g, ". $1");
                    for (let songIndex of songIndexes) {
                        let songOutput = albumOutput.songs[songIndex];
                        let song = new Song();
                        song.parser = songParserMap.get(songIndex);
                        song.title = songOutput.title;
                        song.track = songOutput.track;
                        song.artists = [...new Set(songOutput.artists
                                .map(value => value.title))].join("; ").replace(/\.(\w)/g, ". $1");
                        if (songFileMap) {
                            song.file = songFileMap.get(songIndex);
                        }
                        songs.push(song);
                    }
                    callback();
                })
                    .catch(error => {
                    callback(error);
                });
            }
            else if (albumFolder) {
                let tagMap = new Map();
                for (let frame of nodeID3v24.readTag(songFileMap.get(0)).frames) {
                    tagMap.set(frame.type, frame.data);
                }
                album = new Album();
                album.date = tagMap.get("TDRL").text.replace("\u0000", "");
                album.label = tagMap.get("TPUB").text;
                album.language = tagMap.get("TLAN").text;
                album.title = tagMap.get("TALB").text;
                album.artists = tagMap.get("TPE2").text;
                async.eachSeries(songFileMap.values(), (songFile, callback) => {
                    let tagMap = new Map();
                    for (let frame of nodeID3v24.readTag(songFile).frames) {
                        tagMap.set(frame.type, frame.data);
                    }
                    let song = new Song();
                    song.title = tagMap.get("TIT2").text;
                    song.track = tagMap.get("TRCK").text;
                    song.artists = tagMap.get("TPE1").text;
                    song.file = songFile;
                    if (tagMap.has("APIC")) {
                        album.art = songFile.replace(".mp3", ".png");
                        fs.writeFile(album.art, tagMap.get("APIC").picture, error => {
                            if (error) {
                                callback(error);
                                return;
                            }
                            songs.push(song);
                            callback();
                        });
                    }
                    else {
                        songs.push(song);
                        callback();
                    }
                }, error => {
                    callback(error);
                });
            }
        }, callback => {
            console.log("Updating album...");
            console.log("Album title: " + album.title);
            console.log("Album artists: " + album.artists);
            console.log("Album date: " + album.date);
            console.log("Album label: " + album.label);
            console.log("Album language: " + album.language);
            rl.question("Update album? (no) ", answer => {
                console.log("");
                if (answer === "y" || answer === "yes") {
                    async.series([
                        callback => {
                            rl.question("Album title: (" + album.title + ") ", answer => {
                                if (answer) {
                                    album.title = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album artists: (" + album.artists + ") ", answer => {
                                if (answer) {
                                    album.artists = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album date: (" + album.date + ") ", answer => {
                                if (answer) {
                                    album.date = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album label: (" + album.label + ") ", answer => {
                                if (answer) {
                                    album.label = answer;
                                }
                                callback();
                            });
                        }, callback => {
                            rl.question("Album language: (" + album.language + ") ", answer => {
                                console.log("");
                                if (answer) {
                                    album.language = answer;
                                }
                                callback();
                            });
                        }
                    ], () => {
                        callback();
                    });
                }
                else {
                    callback();
                }
            });
        }, callback => {
            async.eachSeries(songs, (song, callback) => {
                console.log("Updating song " + song.track + "...");
                console.log("Song track: " + song.track);
                console.log("Song title: " + song.title);
                console.log("Song artists: " + song.artists);
                rl.question("Update song " + song.track + "? (no) ", answer => {
                    console.log("");
                    if (answer === "y" || answer === "yes") {
                        async.series([
                            callback => {
                                rl.question("Song track: (" + song.track + ") ", answer => {
                                    if (answer) {
                                        song.track = answer;
                                    }
                                    callback();
                                });
                            }, callback => {
                                rl.question("Song title: (" + song.title + ") ", answer => {
                                    if (answer) {
                                        song.title = answer;
                                    }
                                    callback();
                                });
                            }, callback => {
                                rl.question("Song artists: (" + song.artists + ") ", answer => {
                                    console.log("");
                                    if (answer) {
                                        song.artists = answer;
                                    }
                                    callback();
                                });
                            }
                        ], () => {
                            callback();
                        });
                    }
                    else {
                        callback();
                    }
                });
            }, () => {
                callback();
            });
        }, callback => {
            album.folder = "Songs/" + album.language + "/";
            if (album.language === "English" && songs[0].title === album.title && songs[0].track === "1") {
                album.folder += "Singles/";
            }
            album.folder += album.date.substr(0, 4) + "/" + album.title.replace(/\//g, "") + "/";
            album.folder = album.folder.replace(/[\\:*?"<>|]/g, "");
            mkdirp(album.folder, error => {
                if (error) {
                    callback(error);
                    return;
                }
                callback();
            });
        }, callback => {
            async.eachSeries(songs, (song, callback) => {
                let songFile;
                if (song.file) {
                    songFile = song.file;
                }
                song.file = album.folder + song.track + " - " + song.title + ".mp3";
                song.file = song.file.replace(/[\\:*?"<>|]/g, "");
                if (!songFile) {
                    let progressBar = new ProgressBar("Downloading song "
                        + song.track + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                        total: 100,
                        width: 10,
                        incomplete: " "
                    }), progress;
                    song.parser.parseFile(downloadProgress => {
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
                        fs.writeFile(song.file, parser.output.file, error => {
                            if (error) {
                                callback(error);
                                return;
                            }
                            callback();
                        });
                    })
                        .catch(error => {
                        callback(error);
                    });
                }
                else {
                    fs.rename(songFile, song.file, error => {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback();
                    });
                }
            }, error => {
                console.log("");
                callback(error);
            });
        }, callback => {
            async.eachSeries(songs, (song, callback) => {
                ffmpeg.ffprobe(song.file, (error, data) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    if (data.format.bit_rate >= 320000) {
                        callback();
                        return;
                    }
                    let tempSongFile = song.file.replace(".mp3", ".tmp");
                    fs.rename(song.file, tempSongFile, error => {
                        if (error) {
                            callback(error);
                            return;
                        }
                        let progressBar = new ProgressBar("Converting song "
                            + song.track + "... [:bar] :percent :sizeMB :etas", {
                            total: 100,
                            width: 10,
                            incomplete: " "
                        }), progress;
                        ffmpeg(tempSongFile)
                            .audioBitrate("320k")
                            .on("progress", convertProgress => {
                            progressBar.update(convertProgress.percent / 100, {
                                size: (convertProgress.targetSize / 1024).toFixed(1)
                            });
                            progress = convertProgress;
                        })
                            .on("error", error => {
                            callback(error);
                        })
                            .on("end", () => {
                            progressBar.update(1, {
                                size: (progress.targetSize / 1024).toFixed(1)
                            });
                            fs.unlink(tempSongFile, error => {
                                if (error) {
                                    callback(error);
                                    return;
                                }
                                callback();
                            });
                        })
                            .save(song.file);
                    });
                });
            }, error => {
                console.log("");
                callback(error);
            });
        }, callback => {
            async.eachSeries(songs, (song, callback) => {
                let albumArt;
                if (album.art) {
                    albumArt = album.art;
                }
                album.art = album.folder + song.track + " - " + song.title + ".png";
                album.art = album.art.replace(/[\\:*?"<>|]/g, "");
                if (!albumArt) {
                    request(album.parser.output.art)
                        .on("error", error => {
                        callback(error);
                    })
                        .pipe(fs.createWriteStream(album.art))
                        .on("finish", () => {
                        Jimp.read(album.art)
                            .then(image => {
                            image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                .write(album.art, error => {
                                if (error) {
                                    callback(error);
                                    return;
                                }
                                callback();
                            });
                        })
                            .catch(error => {
                            callback(error);
                        });
                    });
                }
                else {
                    fs.rename(albumArt, album.art, error => {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback();
                    });
                }
            }, error => {
                callback(error);
            });
        }, callback => {
            async.eachSeries(songs, (song, callback) => {
                nodeID3v23.removeTags(song.file);
                nodeID3v23.write({
                    album: album.title,
                    artist: song.artists,
                    image: album.art,
                    language: album.language,
                    performerInfo: album.artists,
                    publisher: album.label,
                    title: song.title,
                    trackNumber: song.track
                }, song.file);
                let tag = nodeID3v24.readTag(song.file, {
                    targetversion: 4
                });
                tag.addFrame("TDRC", [album.date]);
                tag.addFrame("TDRL", [album.date]);
                tag.write();
                fs.unlink(album.art, error => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback();
                });
            }, () => {
                console.log("Completed!");
                callback();
            });
        }
    ], error => {
        rl.close();
        if (error) {
            console.error(error);
        }
    });
});
program.parse(process.argv);

//# sourceMappingURL=index.js.map
