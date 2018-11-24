import * as musique from "musique";
import {AlbumOutput, SongOutput, SongParser} from "musique";
import * as async from "async";
import * as program from "commander";
import * as ffmpeg from "fluent-ffmpeg";
import * as mkdirp from "mkdirp";
import * as moment from "moment";
import * as ProgressBar from "progress";
import * as request from "request";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const Jimp = require("jimp");
const nodeID3 = require("node-id3v2.4");

class Album {
    title: string;
    artists: string;
    date: string;
    label: string;
    language: string;
    art: string;
    folder: string;
}

class Song {
    track: string;
    title: string;
    artists: string;
    file: string;
    parser: SongParser;
}

program
    .command("song")
    .action(() => {
        console.log("Musique");
        console.log("");

        let songUrl: string,
            songFile: string;

        let album: Album,
            song: Song;

        async.series([
            callback => {
                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

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
                            rl.close();

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
                })
            }, callback => {
                if (songUrl) {
                    console.log("Parsing song...");

                    let platform: "deezer" | "saavn";

                    if (songUrl.includes("deezer")) {
                        platform = "deezer";
                    } else if (songUrl.includes("saavn")) {
                        platform = "saavn";
                    }

                    musique.parseSong(platform, songUrl)
                        .then(parser => parser.parse())
                        .then(parser => parser.parseAlbum(childParser => {
                            console.log("Parsing album...");
                            console.log("");

                            return childParser.parse();
                        }))
                        .then(parser => {
                            let songOutput: SongOutput = parser.output,
                                albumOutput: AlbumOutput = songOutput.album;

                            album = new Album();
                            album.art = albumOutput.art;
                            album.date = albumOutput.date;
                            album.label = albumOutput.label;
                            album.language = albumOutput.language;
                            album.title = albumOutput.title;
                            album.artists = [...new Set<string>(albumOutput.artists
                                .map(artist => artist.title))].join("; ").replace(/\.(\w)/g, ". $1");

                            song = new Song();
                            song.parser = parser;
                            song.title = songOutput.title;
                            song.track = songOutput.track;
                            song.artists = [...new Set<string>(songOutput.artists
                                .map(artist => artist.title))].join("; ").replace(/\.(\w)/g, ". $1");

                            if (songFile) {
                                song.file = songFile;
                            }

                            callback();
                        })
                        .catch(error => {
                            callback(error);
                        });
                } else if (songFile) {
                    let tag = nodeID3.readTag(songFile);

                    let tagMap: Map<string, any> = new Map<string, any>();

                    if (tag.frames) {
                        for (let frame of tag.frames) {
                            tagMap.set(frame.type, frame.data);
                        }
                    }

                    album = new Album();

                    if (tagMap.has("TDRL")) {
                        album.date = tagMap.get("TDRL").text;
                    }

                    if (tagMap.has("TPUB")) {
                        album.label = tagMap.get("TPUB").text;
                    }

                    if (tagMap.has("TLAN")) {
                        album.language = tagMap.get("TLAN").text;
                    }

                    if (tagMap.has("TALB")) {
                        album.title = tagMap.get("TALB").text;
                    }

                    if (tagMap.has("TPE2")) {
                        album.artists = tagMap.get("TPE2").text;
                    }

                    song = new Song();

                    if (tagMap.has("TIT2")) {
                        song.title = tagMap.get("TIT2").text;
                    }

                    if (tagMap.has("TRCK")) {
                        song.track = tagMap.get("TRCK").text;
                    }

                    if (tagMap.has("TPE1")) {
                        song.artists = tagMap.get("TPE1").text;
                    }

                    song.file = songFile;

                    if (!tagMap.has("APIC")) {
                        callback();
                        return;
                    }

                    album.art = path.dirname(songFile)
                        + "/" + album.title.replace(/[/.]/g, "") + ".png";

                    fs.writeFile(album.art, tagMap.get("APIC").picture, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }
            }, callback => {
                console.log("Updating album...");
                console.log("Album title: " + album.title);
                console.log("Album artists: " + album.artists);
                console.log("Album date: " + (album.date ? moment(album.date, "YYYY-MM-DD").format("D-M-YYYY") : ""));
                console.log("Album label: " + album.label);
                console.log("Album language: " + album.language);
                console.log("Album art: " + album.art);

                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question("Update album? (no) ", answer => {
                    console.log("");

                    if (!(answer === "y" || answer === "yes")) {
                        rl.close();

                        callback();
                        return;
                    }

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
                            rl.question("Album date: (" + (album.date ? moment(album.date, "YYYY-MM-DD").format("D-M-YYYY") : "") + ") ", answer => {
                                if (answer) {
                                    album.date = moment(answer, "D-M-YYYY").format("YYYY-MM-DD");
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
                                if (answer) {
                                    album.language = answer;
                                }

                                callback();
                            });
                        }, callback => {
                            rl.question("Album art: (" + album.art + ") ", answer => {
                                rl.close();

                                console.log("");

                                if (answer) {
                                    album.art = answer;
                                }

                                callback();
                            });
                        }
                    ], () => {
                        callback();
                    });
                });
            }, callback => {
                console.log("Updating song...");
                console.log("Song track: " + song.track);
                console.log("Song title: " + song.title);
                console.log("Song artists: " + song.artists);

                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question("Update song? (no) ", answer => {
                    console.log("");

                    if (!(answer === "y" || answer === "yes")) {
                        rl.close();

                        callback();
                        return;
                    }

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
                                rl.close();

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
                });
            }, callback => {
                album.folder = "Songs/" + album.language + "/";

                if (album.language === "English" && song.title === album.title && song.track === "1") {
                    album.folder += "Singles/";
                }

                album.folder += album.date.substr(0, 4) + "/" + album.title.replace(/[/.]/g, "") + "/";
                album.folder = album.folder.replace(/[\\:*?"<>|]/g, "");

                mkdirp(album.folder, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                let songFile: string;

                if (song.file) {
                    songFile = song.file;
                }

                song.file = album.folder + song.track + " - " + song.title.replace(/[/.]/g, "") + ".mp3";
                song.file = song.file.replace(/[\\:*?"<>|]/g, "");

                if (!songFile) {
                    let progressBar: ProgressBar = new ProgressBar("Downloading song"
                        + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                        total: 100,
                        width: 10,
                        incomplete: " "
                    }), progress: any;

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
                } else {
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

                    let tempFile: string = song.file.replace(".mp3", ".tmp");

                    fs.rename(song.file, tempFile, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        let progressBar: ProgressBar = new ProgressBar("Converting song"
                            + "... [:bar] :percent :sizeMB :etas", {
                            total: 100,
                            width: 10,
                            incomplete: " "
                        }), progress: any;

                        ffmpeg(tempFile)
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

                                console.log("");

                                fs.unlink(tempFile, error => {
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
            }, callback => {
                let albumArt: string = album.art;

                album.art = album.folder + album.title.replace(/[/.]/g, "") + ".png";
                album.art = album.art.replace(/[\\:*?"<>|]/g, "");

                if (albumArt.startsWith("http")) {
                    request(albumArt)
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
                } else {
                    Jimp.read(albumArt)
                        .then(image => {
                            if (image.getMIME() !== "image/png"
                                || image.bitmap.width !== 512 || image.bitmap.height !== 512) {
                                image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                    .write(album.art, error => {
                                        if (error) {
                                            callback(error);
                                            return;
                                        }

                                        callback();
                                    });
                            } else {
                                fs.rename(albumArt, album.art, error => {
                                    if (error) {
                                        callback(error);
                                        return;
                                    }

                                    callback();
                                });
                            }
                        })
                        .catch(error => {
                            callback(error);
                        });
                }
            }, callback => {
                let tag = nodeID3.readTag(song.file, {
                    targetversion: 4
                });

                if (tag.iserror) {
                    tag = nodeID3.createTag(song.file, {
                        targetversion: 4
                    });
                }

                tag.frames = [];

                tag.addFrame("APIC", [album.art, 0x03]);
                tag.addFrame("TALB", [album.title]);
                tag.addFrame("TCON", [album.language]);
                tag.addFrame("TDRC", [album.date.substr(0, 4)]);
                tag.addFrame("TDRL", [album.date]);
                tag.addFrame("TIT2", [song.title]);
                tag.addFrame("TLAN", [album.language]);
                tag.addFrame("TPE1", [song.artists]);
                tag.addFrame("TPE2", [album.artists]);
                tag.addFrame("TPUB", [album.label]);
                tag.addFrame("TRCK", [song.track]);

                for (let frame of tag.frames) {
                    frame.data.encoding = 0;
                }

                tag.write();

                callback();
            }, callback => {
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

        let albumUrl: string,
            albumFolder: string,
            songTracks: string;

        let songFileMap: Map<number, string>;

        let album: Album,
            songs: Song[] = [];

        async.series([
            callback => {
                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

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
                            rl.close();

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
                if (!albumFolder) {
                    callback();
                    return;
                }

                fs.readdir(albumFolder, (error, files) => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    songFileMap = new Map<number, string>();

                    for (let file of files.filter(file => file.endsWith(".mp3"))
                        .sort((a, b) => {
                            let aTrack: number = 0,
                                bTrack: number = 0;

                            let aMatch = a.match(/(\d+) - /);

                            if (aMatch) {
                                aTrack = parseInt(aMatch[1]);
                            }

                            let bMatch = b.match(/(\d+) - /);

                            if (bMatch) {
                                bTrack = parseInt(bMatch[1]);
                            }

                            return aTrack - bTrack;
                        })) {
                        let fileMatch = file.match(/(\d+) - /);

                        if (fileMatch) {
                            songFileMap.set(parseInt(fileMatch[1]) - 1, albumFolder + "/" + file);
                        } else {
                            songFileMap.set(songFileMap.size, albumFolder + "/" + file);
                        }
                    }

                    callback();
                });
            }, callback => {
                if (albumUrl) {
                    console.log("Parsing album...");

                    let songIndexes: number[] = [...new Set<number>(songTracks.split(", ")
                        .map(songTrack => parseInt(songTrack) - 1))].sort((a, b) => a - b);

                    let platform: "deezer" | "saavn";

                    if (albumUrl.includes("deezer")) {
                        platform = "deezer";
                    } else if (albumUrl.includes("saavn")) {
                        platform = "saavn";
                    }

                    let songParserMap: Map<number, SongParser> = new Map<number, SongParser>();

                    musique.parseAlbum(platform, albumUrl)
                        .then(parser => parser.parse())
                        .then(parser => parser.parseSongs((childParser, index) => {
                            songParserMap.set(index, childParser);

                            console.log("Parsing song " + (index + 1) + "...");

                            return childParser.parse();
                        }, ...songIndexes))
                        .then(parser => {
                            console.log("");

                            let albumOutput: AlbumOutput = parser.output;

                            album = new Album();
                            album.art = albumOutput.art;
                            album.date = albumOutput.date;
                            album.label = albumOutput.label;
                            album.language = albumOutput.language;
                            album.title = albumOutput.title;
                            album.artists = [...new Set<string>(albumOutput.artists
                                .map(artist => artist.title))].join("; ").replace(/\.(\w)/g, ". $1");

                            for (let songIndex of songIndexes) {
                                let songOutput: SongOutput = albumOutput.songs[songIndex];

                                let song: Song = new Song();
                                song.parser = songParserMap.get(songIndex);
                                song.title = songOutput.title;
                                song.track = songOutput.track;
                                song.artists = [...new Set<string>(songOutput.artists
                                    .map(artist => artist.title))].join("; ").replace(/\.(\w)/g, ". $1");

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
                } else if (albumFolder) {
                    let tag = nodeID3.readTag(songFileMap.values().next().value);

                    let tagMap: Map<string, any> = new Map<string, any>();

                    if (tag.frames) {
                        for (let frame of tag.frames) {
                            tagMap.set(frame.type, frame.data);
                        }
                    }

                    album = new Album();

                    if (tagMap.has("TDRL")) {
                        album.date = tagMap.get("TDRL").text;
                    }

                    if (tagMap.has("TPUB")) {
                        album.label = tagMap.get("TPUB").text;
                    }

                    if (tagMap.has("TLAN")) {
                        album.language = tagMap.get("TLAN").text;
                    }

                    if (tagMap.has("TALB")) {
                        album.title = tagMap.get("TALB").text;
                    }

                    if (tagMap.has("TPE2")) {
                        album.artists = tagMap.get("TPE2").text;
                    }

                    for (let songFile of songFileMap.values()) {
                        let tag = nodeID3.readTag(songFile);

                        let tagMap: Map<string, any> = new Map<string, any>();

                        if (tag.frames) {
                            for (let frame of tag.frames) {
                                tagMap.set(frame.type, frame.data);
                            }
                        }

                        let song: Song = new Song();

                        if (tagMap.has("TIT2")) {
                            song.title = tagMap.get("TIT2").text;
                        }

                        if (tagMap.has("TRCK")) {
                            song.track = tagMap.get("TRCK").text;
                        }

                        if (tagMap.has("TPE1")) {
                            song.artists = tagMap.get("TPE1").text;
                        }

                        song.file = songFile;

                        songs.push(song);
                    }

                    if (!tagMap.has("APIC")) {
                        callback();
                        return;
                    }

                    album.art = path.dirname(songFileMap.values().next().value)
                        + "/" + album.title.replace(/[/.]/g, "") + ".png";

                    fs.writeFile(album.art, tagMap.get("APIC").picture, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }
            }, callback => {
                console.log("Updating album...");
                console.log("Album title: " + album.title);
                console.log("Album artists: " + album.artists);
                console.log("Album date: " + (album.date ? moment(album.date, "YYYY-MM-DD").format("D-M-YYYY") : ""));
                console.log("Album label: " + album.label);
                console.log("Album language: " + album.language);
                console.log("Album art: " + album.art);

                let rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question("Update album? (no) ", answer => {
                    console.log("");

                    if (!(answer === "y" || answer === "yes")) {
                        rl.close();

                        callback();
                        return;
                    }

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
                            rl.question("Album date: (" + (album.date ? moment(album.date, "YYYY-MM-DD").format("D-M-YYYY") : "") + ") ", answer => {
                                if (answer) {
                                    album.date = moment(answer, "D-M-YYYY").format("YYYY-MM-DD");
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
                                if (answer) {
                                    album.language = answer;
                                }

                                callback();
                            });
                        }, callback => {
                            rl.question("Album art: (" + album.art + ") ", answer => {
                                rl.close();

                                console.log("");

                                if (answer) {
                                    album.art = answer;
                                }

                                callback();
                            });
                        }
                    ], () => {
                        callback();
                    });
                });
            }, callback => {
                async.eachSeries(songs, (song, callback) => {
                    console.log("Updating song " + song.track + "...");
                    console.log("Song track: " + song.track);
                    console.log("Song title: " + song.title);
                    console.log("Song artists: " + song.artists);

                    let rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    rl.question("Update song " + song.track + "? (no) ", answer => {
                        console.log("");

                        if (!(answer === "y" || answer === "yes")) {
                            rl.close();

                            callback();
                            return;
                        }

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
                                    rl.close();

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
                    });
                }, () => {
                    callback();
                })
            }, callback => {
                album.folder = "Songs/" + album.language + "/";

                if (album.language === "English" && songs[0].title === album.title && songs[0].track === "1") {
                    album.folder += "Singles/";
                }

                album.folder += album.date.substr(0, 4) + "/" + album.title.replace(/[/.]/g, "") + "/";
                album.folder = album.folder.replace(/[\\:*?"<>|]/g, "");

                mkdirp(album.folder, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                async.eachOfSeries(songs, (song, index, callback) => {
                    let songFile: string;

                    if (song.file) {
                        songFile = song.file;
                    }

                    song.file = album.folder + song.track + " - " + song.title.replace(/[/.]/g, "") + ".mp3";
                    song.file = song.file.replace(/[\\:*?"<>|]/g, "");

                    if (!songFile) {
                        let progressBar: ProgressBar = new ProgressBar("Downloading song "
                            + song.track + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                            total: 100,
                            width: 10,
                            incomplete: " "
                        }), progress: any;

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

                                if (index == songs.length - 1) {
                                    console.log("");
                                }

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
                    } else {
                        fs.rename(songFile, song.file, error => {
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
                async.eachOfSeries(songs, (song, index, callback) => {
                    ffmpeg.ffprobe(song.file, (error, data) => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        if (data.format.bit_rate >= 320000) {
                            callback();
                            return;
                        }

                        let tempFile: string = song.file.replace(".mp3", ".tmp");

                        fs.rename(song.file, tempFile, error => {
                            if (error) {
                                callback(error);
                                return;
                            }

                            let progressBar: ProgressBar = new ProgressBar("Converting song "
                                + song.track + "... [:bar] :percent :sizeMB :etas", {
                                total: 100,
                                width: 10,
                                incomplete: " "
                            }), progress: any;

                            ffmpeg(tempFile)
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

                                    if (index == songs.length - 1) {
                                        console.log("");
                                    }

                                    fs.unlink(tempFile, error => {
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
                    callback(error);
                });
            }, callback => {
                let albumArt: string = album.art;

                album.art = album.folder + album.title.replace(/[/.]/g, "") + ".png";
                album.art = album.art.replace(/[\\:*?"<>|]/g, "");

                if (albumArt.startsWith("http")) {
                    request(albumArt)
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
                } else {
                    Jimp.read(albumArt)
                        .then(image => {
                            if (image.getMIME() !== "image/png"
                                || image.bitmap.width !== 512 || image.bitmap.height !== 512) {
                                image.resize(512, 512, Jimp.RESIZE_NEAREST_NEIGHBOR)
                                    .write(album.art, error => {
                                        if (error) {
                                            callback(error);
                                            return;
                                        }

                                        callback();
                                    });
                            } else {
                                fs.rename(albumArt, album.art, error => {
                                    if (error) {
                                        callback(error);
                                        return;
                                    }

                                    callback();
                                });
                            }
                        })
                        .catch(error => {
                            callback(error);
                        });
                }
            }, callback => {
                for (let song of songs) {
                    let tag = nodeID3.readTag(song.file, {
                        targetversion: 4
                    });

                    if (tag.iserror) {
                        tag = nodeID3.createTag(song.file, {
                            targetversion: 4
                        });
                    }

                    tag.frames = [];

                    tag.addFrame("APIC", [album.art, 0x03]);
                    tag.addFrame("TALB", [album.title]);
                    tag.addFrame("TCON", [album.language]);
                    tag.addFrame("TDRC", [album.date.substr(0, 4)]);
                    tag.addFrame("TDRL", [album.date]);
                    tag.addFrame("TIT2", [song.title]);
                    tag.addFrame("TLAN", [album.language]);
                    tag.addFrame("TPE1", [song.artists]);
                    tag.addFrame("TPE2", [album.artists]);
                    tag.addFrame("TPUB", [album.label]);
                    tag.addFrame("TRCK", [song.track]);

                    for (let frame of tag.frames) {
                        frame.data.encoding = 0;
                    }

                    tag.write();
                }

                callback();
            }, callback => {
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
            if (error) {
                console.error(error);
            }
        });
    });

program.parse(process.argv);
