import * as async from "async";
import * as program from "commander";
import * as ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as Jimp from "jimp";
import * as moment from "moment";
import * as musique from "musique";
import {AlbumOutput, PlaylistOutput, SongOutput, SongParser} from "musique";
import * as nodeID3v2 from "node-id3v2.4";
import * as os from "os";
import * as path from "path";
import * as ProgressBar from "progress";
import * as readline from "readline";
import * as request from "request";

class Album {
    title: string;
    artists: string;
    date: string;
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

function mkdirp(folder: string, callback: (error?: any) => void): void {
    fs.stat(folder, error => {
        if (!error) {
            callback();
            return;
        }

        mkdirp(path.dirname(folder), error => {
            if (error) {
                callback(error);
                return;
            }

            fs.mkdir(folder, error => {
                if (error) {
                    callback(error);
                    return;
                }

                callback();
            });
        });
    });
}

function rmdirp(folder: string, callback: (error?: any) => void): void {
    fs.readdir(folder, (error, files) => {
        if (error) {
            callback(error);
            return;
        }

        if (files.length > 0) {
            callback();
            return;
        }

        fs.rmdir(folder, error => {
            if (error) {
                callback(error);
                return;
            }

            rmdirp(path.dirname(folder), error => {
                if (error) {
                    callback(error);
                    return;
                }

                callback();
            });
        });
    });
}

function readdirp(folder: string, callback: (error?: any, files?: string[]) => void): void {
    fs.readdir(folder, (error, files) => {
        if (error) {
            callback(error);
            return;
        }

        let allFiles: string[] = [];

        async.eachOfSeries(files, (file, index, callback) => {
            allFiles.push(file);

            fs.stat(path.join(folder, file), (error, stats) => {
                if (error) {
                    callback(error);
                    return;
                }

                if (!stats.isDirectory()) {
                    callback();
                    return;
                }

                readdirp(path.join(folder, file), (error, childFiles) => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    for (let childFile of childFiles) {
                        allFiles.push(file + path.sep + childFile);
                    }

                    callback();
                });
            });
        }, error => {
            if (error) {
                callback(error);
                return;
            }

            callback(undefined, allFiles);
        });
    });
}

program
    .command("song")
    .option("-y, --yes")
    .option("-n, --no")
    .action(options => {
        console.log("Musique");
        console.log("");

        let songUrl: string,
            songFile: string;

        let album: Album,
            song: Song;

        async.series([
            callback => {
                let rl: any = readline.createInterface({
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
                            if (answer) {
                                songFile = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        console.log("");

                        rl.close();

                        if (!songUrl && !songFile) {
                            callback(new Error());
                            return;
                        }

                        callback();
                    }
                ], error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                if (songUrl) {
                    console.log("Parsing song...");

                    let platformName: "deezer" | "saavn";

                    if (songUrl.includes("deezer")) {
                        platformName = "deezer";
                    } else if (songUrl.includes("saavn")) {
                        platformName = "saavn";
                    }

                    musique.parseSong(platformName, songUrl)
                        .then(songParser => songParser.parse())
                        .then(songParser => songParser.parseAlbum(albumParser => {
                            console.log("Parsing album...");

                            return albumParser.parse();
                        }))
                        .then(songParser => {
                            console.log("");

                            let songOutput: SongOutput = songParser.output,
                                albumOutput: AlbumOutput = songOutput.album;

                            album = new Album();
                            album.art = albumOutput.art;
                            album.date = albumOutput.date;
                            album.language = albumOutput.language;
                            album.title = albumOutput.title;
                            album.artists = [...new Set<string>(albumOutput.artists
                                .map(artistOutput => artistOutput.title))]
                                .join("; ").replace(/\.(\w)/g, ". $1");

                            song = new Song();
                            song.parser = songParser;
                            song.title = songOutput.title;
                            song.track = songOutput.track;
                            song.artists = [...new Set<string>(songOutput.artists
                                .map(artistOutput => artistOutput.title))]
                                .join("; ").replace(/\.(\w)/g, ". $1");

                            if (songFile) {
                                song.file = songFile;
                            }

                            callback();
                        })
                        .catch(error => {
                            callback(error);
                        });
                } else if (songFile) {
                    let id3: any = nodeID3v2.readTag(songFile);

                    let id3DataMap: Map<string, any> = new Map<string, any>();

                    if (id3.frames) {
                        for (let id3Frame of id3.frames) {
                            id3DataMap.set(id3Frame.type, id3Frame.data);
                        }
                    }

                    album = new Album();

                    if (id3DataMap.has("APIC") && id3DataMap.has("TALB")) {
                        album.art = path.join(path.dirname(songFile), (<string> id3DataMap.get("TALB").text)
                            .replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".png");
                    }

                    if (id3DataMap.has("TDRL")) {
                        album.date = id3DataMap.get("TDRL").text;
                    }

                    if (id3DataMap.has("TLAN")) {
                        album.language = id3DataMap.get("TLAN").text;
                    }

                    if (id3DataMap.has("TALB")) {
                        album.title = id3DataMap.get("TALB").text;
                    }

                    if (id3DataMap.has("TPE2")) {
                        album.artists = id3DataMap.get("TPE2").text;
                    }

                    song = new Song();

                    if (id3DataMap.has("TIT2")) {
                        song.title = id3DataMap.get("TIT2").text;
                    }

                    if (id3DataMap.has("TRCK")) {
                        song.track = id3DataMap.get("TRCK").text;
                    }

                    if (id3DataMap.has("TPE1")) {
                        song.artists = id3DataMap.get("TPE1").text;
                    }

                    song.file = songFile;

                    if (!album.art) {
                        callback();
                        return;
                    }

                    fs.writeFile(album.art, id3DataMap.get("APIC").picture, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }
            }, callback => {
                let albumDate: string = "";

                if (album.date) {
                    albumDate = moment(album.date, "YYYY-MM-DD").format("D-M-YYYY");
                }

                console.log("Updating album...");
                console.log("Album title: " + album.title);
                console.log("Album artists: " + album.artists);
                console.log("Album date: " + albumDate);
                console.log("Album language: " + album.language);
                console.log("Album art: " + album.art);

                let rl: any = readline.createInterface({
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
                            rl.question("Album date: (" + albumDate + ") ", answer => {
                                if (answer) {
                                    album.date = moment(answer, "D-M-YYYY").format("YYYY-MM-DD");
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
                                if (answer) {
                                    album.art = answer;
                                }

                                callback();
                            });
                        }, callback => {
                            console.log("");

                            rl.close();

                            callback();
                        }
                    ], error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                });

                if (options.yes) {
                    rl.write("yes" + os.EOL);
                } else if (options.no) {
                    rl.write("no" + os.EOL);
                }
            }, callback => {
                console.log("Updating song...");
                console.log("Song track: " + song.track);
                console.log("Song title: " + song.title);
                console.log("Song artists: " + song.artists);

                let rl: any = readline.createInterface({
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
                                if (answer) {
                                    song.artists = answer;
                                }

                                callback();
                            });
                        }, callback => {
                            console.log("");

                            rl.close();

                            callback();
                        }
                    ], error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                });

                if (options.yes) {
                    rl.write("yes" + os.EOL);
                } else if (options.no) {
                    rl.write("no" + os.EOL);
                }
            }, callback => {
                album.folder = path.join("Songs", album.language);

                if (album.language === "English"
                    && song.track === "1"
                    && song.title === album.title) {
                    album.folder = path.join(album.folder, "Singles");
                }

                album.folder = path.join(album.folder, album.date.substr(0, 4),
                    album.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim());

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

                song.file = path.join(album.folder, song.track + " - "
                    + song.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".mp3");

                if (!songFile) {
                    let progressBar: ProgressBar = new ProgressBar("Downloading song"
                        + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                        total: 100,
                        width: 10,
                        incomplete: " "
                    });

                    let progress: any;

                    song.parser.parseFile(downloadProgress => {
                        progressBar.update(downloadProgress.percent, {
                            speed: (downloadProgress.speed / 1024 / 1024).toFixed(1),
                            size: (downloadProgress.size.transferred / 1024 / 1024).toFixed(1)
                        });

                        progress = downloadProgress;
                    })
                        .then(songParser => {
                            progressBar.update(1, {
                                speed: (0).toFixed(1),
                                size: (progress.size.total / 1024 / 1024).toFixed(1)
                            });

                            console.log("");

                            fs.writeFile(song.file, songParser.output.file, error => {
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

                    let tempSongFile: string = song.file.replace(".mp3", ".tmp");

                    fs.rename(song.file, tempSongFile, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        let progressBar: ProgressBar = new ProgressBar("Converting song"
                            + "... [:bar] :percent :sizeMB :etas", {
                            total: 100,
                            width: 10,
                            incomplete: " "
                        });

                        let progress: any;

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

                                console.log("");

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
            }, callback => {
                let albumArt: string = album.art;

                album.art = path.join(album.folder,
                    album.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".png");

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
                                || image.bitmap.width !== 512
                                || image.bitmap.height !== 512) {
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
                let id3: any = nodeID3v2.readTag(song.file, {
                    targetversion: 4
                });

                if (id3.iserror) {
                    id3 = nodeID3v2.createTag(song.file, {
                        targetversion: 4
                    });
                }

                id3.frames = [];

                id3.addFrame("APIC", [album.art, 0x03]);
                id3.addFrame("TALB", [album.title + "\u0000"]);
                id3.addFrame("TCON", [album.language + "\u0000"]);
                id3.addFrame("TDRC", [album.date.substr(0, 4) + "\u0000"]);
                id3.addFrame("TDRL", [album.date + "\u0000"]);
                id3.addFrame("TIT2", [song.title + "\u0000"]);
                id3.addFrame("TLAN", [album.language + "\u0000"]);
                id3.addFrame("TPE1", [song.artists + "\u0000"]);
                id3.addFrame("TPE2", [album.artists + "\u0000"]);
                id3.addFrame("TRCK", [song.track + "\u0000"]);

                for (let id3Frame of id3.frames) {
                    if (id3Frame.type === "APIC") {
                        id3Frame.data.encoding = 0;
                    } else {
                        id3Frame.data.encoding = 3;
                    }
                }

                id3.write();

                callback();
            }, callback => {
                fs.unlink(album.art, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                if (!songFile) {
                    callback();
                    return;
                }

                rmdirp(path.dirname(songFile), error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                console.log("Completed!");

                callback();
            }
        ], error => {
            if (error) {
                console.error(error);
            }
        });
    });

program
    .command("album")
    .option("-y, --yes")
    .option("-n, --no")
    .action(options => {
        console.log("Musique");
        console.log("");

        let albumUrl: string,
            albumFolder: string,
            songTracks: string;

        let songIndexes: number[],
            songFileMap: Map<number, string>;

        let album: Album,
            songs: Song[];

        async.series([
            callback => {
                let rl: any = readline.createInterface({
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
                            if (answer) {
                                songTracks = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        console.log("");

                        rl.close();

                        if (!albumUrl && !albumFolder) {
                            callback(new Error());
                            return;
                        }

                        callback();
                    }
                ], error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                if (!songTracks) {
                    callback();
                    return;
                }

                songIndexes = [...new Set<number>(songTracks.split(", ")
                    .map(songTrack => parseInt(songTrack) - 1))]
                    .sort((songIndexA, songIndexB) => songIndexA - songIndexB);

                callback();
            }, callback => {
                if (!albumFolder) {
                    callback();
                    return;
                }

                songFileMap = new Map<number, string>();

                fs.readdir(albumFolder, (error, files) => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    let songFiles: string[] = files.filter(file => file.endsWith(".mp3")),
                        songIndexMap: Map<string, number> = new Map<string, number>();

                    for (let songFile of songFiles) {
                        let songFileMatch: any = songFile.match(/^(\d+) - .+?\.mp3$/);

                        if (songFileMatch) {
                            songIndexMap.set(songFile, parseInt(songFileMatch[1]) - 1);
                        }
                    }

                    for (let songFile of songFiles.sort((songFileA, songFileB) => {
                        if (songIndexMap.has(songFileA) && songIndexMap.has(songFileB)) {
                            return songIndexMap.get(songFileA) - songIndexMap.get(songFileB);
                        }

                        return 0;
                    })) {
                        let songIndex: number;

                        if (songIndexMap.has(songFile)) {
                            if (!songIndexes) {
                                songIndex = songIndexMap.get(songFile);
                            } else {
                                let index: number = songIndexMap.get(songFile);

                                if (songIndexes.includes(index)) {
                                    songIndex = index;
                                }
                            }
                        } else {
                            if (!songIndexes) {
                                songIndex = songFileMap.size;
                            } else {
                                let index: number = songIndexes[songFileMap.size];

                                if (index >= 0) {
                                    songIndex = index;
                                }
                            }
                        }

                        if (songIndex >= 0) {
                            songFileMap.set(songIndex, path.join(albumFolder, songFile));
                        }
                    }

                    callback();
                });
            }, callback => {
                if (albumUrl) {
                    console.log("Parsing album...");

                    let platformName: "deezer" | "saavn";

                    if (albumUrl.includes("deezer")) {
                        platformName = "deezer";
                    } else if (albumUrl.includes("saavn")) {
                        platformName = "saavn";
                    }

                    let songParseCount: number = 0,
                        songParserMap: Map<number, SongParser> = new Map<number, SongParser>();

                    musique.parseAlbum(platformName, albumUrl)
                        .then(albumParser => albumParser.parse())
                        .then(albumParser => albumParser.parseSongs((songParser, index) => {
                            console.log("Parsing song " + (songParseCount + 1) + "...");

                            songParseCount++;
                            songParserMap.set(index, songParser);

                            return songParser.parse();
                        }, ...(songIndexes ? songIndexes : [])))
                        .then(albumParser => {
                            console.log("");

                            let albumOutput: AlbumOutput = albumParser.output;

                            album = new Album();
                            album.art = albumOutput.art;
                            album.date = albumOutput.date;
                            album.language = albumOutput.language;
                            album.title = albumOutput.title;
                            album.artists = [...new Set<string>(albumOutput.artists
                                .map(artistOutput => artistOutput.title))]
                                .join("; ").replace(/\.(\w)/g, ". $1");

                            if (!songIndexes) {
                                songIndexes = [];

                                for (let i: number = 0; i < albumOutput.songs.length; i++) {
                                    songIndexes.push(i);
                                }
                            }

                            songs = [];

                            for (let songIndex of songIndexes) {
                                let songOutput: SongOutput = albumOutput.songs[songIndex];

                                let song: Song = new Song();
                                song.parser = songParserMap.get(songIndex);
                                song.title = songOutput.title;
                                song.track = songOutput.track;
                                song.artists = [...new Set<string>(songOutput.artists
                                    .map(artistOutput => artistOutput.title))]
                                    .join("; ").replace(/\.(\w)/g, ". $1");

                                if (songFileMap) {
                                    let songFile: string = songFileMap.get(songIndex);

                                    if (songFile) {
                                        song.file = songFile;
                                    }
                                }

                                songs.push(song);
                            }

                            callback();
                        })
                        .catch(error => {
                            callback(error);
                        });
                } else if (albumFolder) {
                    let songFile: string = songFileMap.values().next().value;

                    let id3: any = nodeID3v2.readTag(songFile);

                    let id3DataMap: Map<string, any> = new Map<string, any>();

                    if (id3.frames) {
                        for (let id3Frame of id3.frames) {
                            id3DataMap.set(id3Frame.type, id3Frame.data);
                        }
                    }

                    album = new Album();

                    if (id3DataMap.has("APIC") && id3DataMap.has("TALB")) {
                        album.art = path.join(path.dirname(songFile), (<string> id3DataMap.get("TALB").text)
                            .replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".png");
                    }

                    if (id3DataMap.has("TDRL")) {
                        album.date = id3DataMap.get("TDRL").text;
                    }

                    if (id3DataMap.has("TLAN")) {
                        album.language = id3DataMap.get("TLAN").text;
                    }

                    if (id3DataMap.has("TALB")) {
                        album.title = id3DataMap.get("TALB").text;
                    }

                    if (id3DataMap.has("TPE2")) {
                        album.artists = id3DataMap.get("TPE2").text;
                    }

                    songs = [];

                    for (let songFile of songFileMap.values()) {
                        let id3: any = nodeID3v2.readTag(songFile);

                        let id3DataMap: Map<string, any> = new Map<string, any>();

                        if (id3.frames) {
                            for (let id3Frame of id3.frames) {
                                id3DataMap.set(id3Frame.type, id3Frame.data);
                            }
                        }

                        let song: Song = new Song();

                        if (id3DataMap.has("TIT2")) {
                            song.title = id3DataMap.get("TIT2").text;
                        }

                        if (id3DataMap.has("TRCK")) {
                            song.track = id3DataMap.get("TRCK").text;
                        }

                        if (id3DataMap.has("TPE1")) {
                            song.artists = id3DataMap.get("TPE1").text;
                        }

                        song.file = songFile;

                        songs.push(song);
                    }

                    if (!album.art) {
                        callback();
                        return;
                    }

                    fs.writeFile(album.art, id3DataMap.get("APIC").picture, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }
            }, callback => {
                let albumDate: string = "";

                if (album.date) {
                    albumDate = moment(album.date, "YYYY-MM-DD").format("D-M-YYYY");
                }

                console.log("Updating album...");
                console.log("Album title: " + album.title);
                console.log("Album artists: " + album.artists);
                console.log("Album date: " + albumDate);
                console.log("Album language: " + album.language);
                console.log("Album art: " + album.art);

                let rl: any = readline.createInterface({
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
                            rl.question("Album date: (" + albumDate + ") ", answer => {
                                if (answer) {
                                    album.date = moment(answer, "D-M-YYYY").format("YYYY-MM-DD");
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
                                if (answer) {
                                    album.art = answer;
                                }

                                callback();
                            });
                        }, callback => {
                            console.log("");

                            rl.close();

                            callback();
                        }
                    ], error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                });

                if (options.yes) {
                    rl.write("yes" + os.EOL);
                } else if (options.no) {
                    rl.write("no" + os.EOL);
                }
            }, callback => {
                async.eachOfSeries(songs, (song, index, callback) => {
                    console.log("Updating song " + (<number> index + 1) + "...");
                    console.log("Song track: " + song.track);
                    console.log("Song title: " + song.title);
                    console.log("Song artists: " + song.artists);

                    let rl: any = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });

                    rl.question("Update song " + (<number> index + 1) + "? (no) ", answer => {
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
                                    if (answer) {
                                        song.artists = answer;
                                    }

                                    callback();
                                });
                            }, callback => {
                                console.log("");

                                rl.close();

                                callback();
                            }
                        ], error => {
                            if (error) {
                                callback(error);
                                return;
                            }

                            callback();
                        });
                    });

                    if (options.yes) {
                        rl.write("yes" + os.EOL);
                    } else if (options.no) {
                        rl.write("no" + os.EOL);
                    }
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                album.folder = path.join("Songs", album.language);

                if (album.language === "English"
                    && songs.length == 1
                    && songs[0].track === "1"
                    && songs[0].title === album.title) {
                    album.folder = path.join(album.folder, "Singles");
                }

                album.folder = path.join(album.folder, album.date.substr(0, 4),
                    album.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim());

                mkdirp(album.folder, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                let songDownloadCount: number = 0;

                async.eachOfSeries(songs, (song, index, callback) => {
                    let songFile: string;

                    if (song.file) {
                        songFile = song.file;
                    }

                    song.file = path.join(album.folder, song.track + " - " +
                        song.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".mp3");

                    if (!songFile) {
                        let progressBar: ProgressBar = new ProgressBar("Downloading song "
                            + (songDownloadCount + 1) + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                            total: 100,
                            width: 10,
                            incomplete: " "
                        });

                        let progress: any;

                        song.parser.parseFile(downloadProgress => {
                            progressBar.update(downloadProgress.percent, {
                                speed: (downloadProgress.speed / 1024 / 1024).toFixed(1),
                                size: (downloadProgress.size.transferred / 1024 / 1024).toFixed(1)
                            });

                            progress = downloadProgress;
                        })
                            .then(songParser => {
                                progressBar.update(1, {
                                    speed: (0).toFixed(1),
                                    size: (progress.size.total / 1024 / 1024).toFixed(1)
                                });

                                songDownloadCount++;

                                fs.writeFile(song.file, songParser.output.file, error => {
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
                    if (error) {
                        callback(error);
                        return;
                    }

                    if (songDownloadCount > 0) {
                        console.log("");
                    }

                    callback();
                });
            }, callback => {
                let songConvertCount: number = 0;

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

                        let tempSongFile: string = song.file.replace(".mp3", ".tmp");

                        fs.rename(song.file, tempSongFile, error => {
                            if (error) {
                                callback(error);
                                return;
                            }

                            let progressBar: ProgressBar = new ProgressBar("Converting song "
                                + (songConvertCount + 1) + "... [:bar] :percent :sizeMB :etas", {
                                total: 100,
                                width: 10,
                                incomplete: " "
                            });

                            let progress: any;

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

                                    songConvertCount++;

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
                    if (error) {
                        callback(error);
                        return;
                    }

                    if (songConvertCount > 0) {
                        console.log("");
                    }

                    callback();
                });
            }, callback => {
                let albumArt: string = album.art;

                album.art = path.join(album.folder,
                    album.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".png");

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
                                || image.bitmap.width !== 512
                                || image.bitmap.height !== 512) {
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
                    let id3: any = nodeID3v2.readTag(song.file, {
                        targetversion: 4
                    });

                    if (id3.iserror) {
                        id3 = nodeID3v2.createTag(song.file, {
                            targetversion: 4
                        });
                    }

                    id3.frames = [];

                    id3.addFrame("APIC", [album.art, 0x03]);
                    id3.addFrame("TALB", [album.title + "\u0000"]);
                    id3.addFrame("TCON", [album.language + "\u0000"]);
                    id3.addFrame("TDRC", [album.date.substr(0, 4) + "\u0000"]);
                    id3.addFrame("TDRL", [album.date + "\u0000"]);
                    id3.addFrame("TIT2", [song.title + "\u0000"]);
                    id3.addFrame("TLAN", [album.language + "\u0000"]);
                    id3.addFrame("TPE1", [song.artists + "\u0000"]);
                    id3.addFrame("TPE2", [album.artists + "\u0000"]);
                    id3.addFrame("TRCK", [song.track + "\u0000"]);

                    for (let id3Frame of id3.frames) {
                        if (id3Frame.type === "APIC") {
                            id3Frame.data.encoding = 0;
                        } else {
                            id3Frame.data.encoding = 3;
                        }
                    }

                    id3.write();
                }

                callback();
            }, callback => {
                fs.unlink(album.art, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                if (!albumFolder) {
                    callback();
                    return;
                }

                rmdirp(albumFolder, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                console.log("Completed!");

                callback();
            }
        ], error => {
            if (error) {
                console.error(error);
            }
        });
    });

program
    .command("playlist")
    .option("-y, --yes")
    .option("-n, --no")
    .action(options => {
        console.log("Musique");
        console.log("");

        let playlistUrl: string,
            playlistFolder: string,
            songTracks: string;

        let songIndexes: number[],
            songFileMap: Map<number, string>;

        let albumMap: Map<string, Album>,
            songsMap: Map<Album, Song[]>;

        async.series([
            callback => {
                let rl: any = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                async.series([
                    callback => {
                        rl.question("Playlist url: ", answer => {
                            if (answer) {
                                playlistUrl = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Playlist folder: ", answer => {
                            if (answer) {
                                playlistFolder = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        rl.question("Song tracks: ", answer => {
                            if (answer) {
                                songTracks = answer;
                            }

                            callback();
                        });
                    }, callback => {
                        console.log("");

                        rl.close();

                        if (!playlistUrl && !playlistFolder) {
                            callback(new Error());
                            return;
                        }

                        callback();
                    }
                ], error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                if (!songTracks) {
                    callback();
                    return;
                }

                songIndexes = [...new Set<number>(songTracks.split(", ")
                    .map(songTrack => parseInt(songTrack) - 1))]
                    .sort((songIndexA, songIndexB) => songIndexA - songIndexB);

                callback();
            }, callback => {
                if (!playlistFolder) {
                    callback();
                    return;
                }

                songFileMap = new Map<number, string>();

                readdirp(playlistFolder, (error, files) => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    let songFiles: string[] = files.filter(file => file.endsWith(".mp3")),
                        songIndexMap: Map<string, number> = new Map<string, number>();

                    for (let songFile of songFiles) {
                        let songFileMatch: any = songFile.match(/^(\d+) - .+?\.mp3$/);

                        if (songFileMatch) {
                            songIndexMap.set(songFile, parseInt(songFileMatch[1]) - 1);
                        }
                    }

                    for (let songFile of songFiles.sort((songFileA, songFileB) => {
                        if (songIndexMap.has(songFileA) && songIndexMap.has(songFileB)) {
                            return songIndexMap.get(songFileA) - songIndexMap.get(songFileB);
                        }

                        return 0;
                    })) {
                        let songIndex: number;

                        if (songIndexMap.has(songFile)) {
                            if (!songIndexes) {
                                songIndex = songIndexMap.get(songFile);
                            } else {
                                let index: number = songIndexMap.get(songFile);

                                if (songIndexes.includes(index)) {
                                    songIndex = index;
                                }
                            }
                        } else {
                            if (!songIndexes) {
                                songIndex = songFileMap.size;
                            } else {
                                let index: number = songIndexes[songFileMap.size];

                                if (index >= 0) {
                                    songIndex = index;
                                }
                            }
                        }

                        if (songIndex >= 0) {
                            songFileMap.set(songIndex, path.join(playlistFolder, songFile));
                        }
                    }

                    callback();
                });
            }, callback => {
                if (playlistUrl) {
                    console.log("Parsing playlist...");

                    let platformName: "deezer" | "saavn";

                    if (playlistUrl.includes("deezer")) {
                        platformName = "deezer";
                    } else if (playlistUrl.includes("saavn")) {
                        platformName = "saavn";
                    }

                    let songParseCount: number = 0,
                        songParserMap: Map<number, SongParser> = new Map<number, SongParser>();

                    musique.parsePlaylist(platformName, playlistUrl)
                        .then(playlistParser => playlistParser.parse())
                        .then(playlistParser => playlistParser.parseSongs((songParser, index) => {
                            console.log("Parsing song " + (songParseCount + 1) + "...");

                            songParseCount++;
                            songParserMap.set(index, songParser);

                            return songParser.parse()
                                .then(songParser => songParser.parseAlbum(albumParser => {
                                    console.log("Parsing album " + songParserMap.size + "...");

                                    return albumParser.parse();
                                }));
                        }, ...(songIndexes ? songIndexes : [])))
                        .then(playlistParser => {
                            console.log("");

                            let playlistOutput: PlaylistOutput = playlistParser.output;

                            if (!songIndexes) {
                                songIndexes = [];

                                for (let i: number = 0; i < playlistOutput.songs.length; i++) {
                                    songIndexes.push(i);
                                }
                            }

                            albumMap = new Map<string, Album>();
                            songsMap = new Map<Album, Song[]>();

                            for (let songIndex of songIndexes) {
                                let songOutput: SongOutput = playlistOutput.songs[songIndex],
                                    albumOutput: AlbumOutput = songOutput.album;

                                let songs: Song[];

                                if (!albumMap.has(albumOutput.title)) {
                                    let album: Album = new Album();
                                    album.art = albumOutput.art;
                                    album.date = albumOutput.date;
                                    album.language = albumOutput.language;
                                    album.title = albumOutput.title;
                                    album.artists = [...new Set<string>(albumOutput.artists
                                        .map(artistOutput => artistOutput.title))]
                                        .join("; ").replace(/\.(\w)/g, ". $1");

                                    albumMap.set(albumOutput.title, album);

                                    songs = [];

                                    songsMap.set(album, songs);
                                } else {
                                    songs = songsMap.get(albumMap.get(albumOutput.title));
                                }

                                let song: Song = new Song();
                                song.parser = songParserMap.get(songIndex);
                                song.title = songOutput.title;
                                song.track = songOutput.track;
                                song.artists = [...new Set<string>(songOutput.artists
                                    .map(artistOutput => artistOutput.title))]
                                    .join("; ").replace(/\.(\w)/g, ". $1");

                                if (songFileMap) {
                                    let songFile: string = songFileMap.get(songIndex);

                                    if (songFile) {
                                        song.file = songFile;
                                    }
                                }

                                songs.push(song);
                            }

                            callback();
                        })
                        .catch(error => {
                            callback(error);
                        });
                } else if (playlistFolder) {
                    albumMap = new Map<string, Album>();
                    songsMap = new Map<Album, Song[]>();

                    let id3PictureMap: Map<Album, any> = new Map<Album, any>();

                    for (let songFile of songFileMap.values()) {
                        let id3: any = nodeID3v2.readTag(songFile);

                        let id3DataMap: Map<string, any> = new Map<string, any>();

                        if (id3.frames) {
                            for (let id3Frame of id3.frames) {
                                id3DataMap.set(id3Frame.type, id3Frame.data);
                            }
                        }

                        let albumTitle: string;

                        if (id3DataMap.has("TALB")) {
                            albumTitle = id3DataMap.get("TALB").text;
                        }

                        let songs: Song[];

                        if (!albumMap.has(albumTitle)) {
                            let album: Album = new Album();

                            if (id3DataMap.has("APIC") && id3DataMap.has("TALB")) {
                                album.art = path.join(path.dirname(songFile), (<string> id3DataMap.get("TALB").text)
                                    .replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".png");
                            }

                            if (id3DataMap.has("TDRL")) {
                                album.date = id3DataMap.get("TDRL").text;
                            }

                            if (id3DataMap.has("TLAN")) {
                                album.language = id3DataMap.get("TLAN").text;
                            }

                            if (id3DataMap.has("TALB")) {
                                album.title = id3DataMap.get("TALB").text;
                            }

                            if (id3DataMap.has("TPE2")) {
                                album.artists = id3DataMap.get("TPE2").text;
                            }

                            id3PictureMap.set(album, id3DataMap.get("APIC").picture);

                            albumMap.set(albumTitle, album);

                            songs = [];

                            songsMap.set(album, songs);
                        } else {
                            songs = songsMap.get(albumMap.get(albumTitle));
                        }

                        let song: Song = new Song();

                        if (id3DataMap.has("TIT2")) {
                            song.title = id3DataMap.get("TIT2").text;
                        }

                        if (id3DataMap.has("TRCK")) {
                            song.track = id3DataMap.get("TRCK").text;
                        }

                        if (id3DataMap.has("TPE1")) {
                            song.artists = id3DataMap.get("TPE1").text;
                        }

                        song.file = songFile;

                        songs.push(song);
                    }

                    async.eachOfSeries(albumMap.values(), (album, index, callback) => {
                        if (!album.art) {
                            callback();
                            return;
                        }

                        fs.writeFile(album.art, id3PictureMap.get(album), error => {
                            if (error) {
                                callback(error);
                                return;
                            }

                            callback();
                        });
                    }, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }
            }, callback => {
                let sortedAlbumMap: Map<string, Album> = new Map<string, Album>();

                for (let album of [...albumMap.values()].sort((albumA, albumB) => {
                    if (albumA.title && albumB.title) {
                        return albumA.title.localeCompare(albumB.title);
                    }

                    return 0;
                })) {
                    sortedAlbumMap.set(album.title, album);
                }

                let sortedSongsMap: Map<Album, Song[]> = new Map<Album, Song[]>();

                for (let album of sortedAlbumMap.values()) {
                    sortedSongsMap.set(album, songsMap.get(album).sort((songA, songB) => {
                        if (songA.track && songB.track) {
                            return parseInt(songA.track) - parseInt(songB.track);
                        }

                        return 0;
                    }));
                }

                albumMap = sortedAlbumMap;
                songsMap = sortedSongsMap;

                callback();
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                async.eachOfSeries(albums, (album, index, callback) => {
                    async.series([
                        callback => {
                            let albumDate: string = "";

                            if (album.date) {
                                albumDate = moment(album.date, "YYYY-MM-DD").format("D-M-YYYY");
                            }

                            console.log("Updating album " + (<number> index + 1) + "...");
                            console.log("Album title: " + album.title);
                            console.log("Album artists: " + album.artists);
                            console.log("Album date: " + albumDate);
                            console.log("Album language: " + album.language);
                            console.log("Album art: " + album.art);

                            let rl: any = readline.createInterface({
                                input: process.stdin,
                                output: process.stdout
                            });

                            rl.question("Update album " + (<number> index + 1) + "? (no) ", answer => {
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
                                        rl.question("Album date: (" + albumDate + ") ", answer => {
                                            if (answer) {
                                                album.date = moment(answer, "D-M-YYYY").format("YYYY-MM-DD");
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
                                            if (answer) {
                                                album.art = answer;
                                            }

                                            callback();
                                        });
                                    }, callback => {
                                        console.log("");

                                        rl.close();

                                        callback();
                                    }
                                ], error => {
                                    if (error) {
                                        callback(error);
                                        return;
                                    }

                                    callback();
                                });
                            });

                            if (options.yes) {
                                rl.write("yes" + os.EOL);
                            } else if (options.no) {
                                rl.write("no" + os.EOL);
                            }
                        }, callback => {
                            let songs: Song[] = songsMap.get(album);

                            async.eachOfSeries(songs, (song, index, callback) => {
                                console.log("Updating song " + (<number> index + 1) + "...");
                                console.log("Song track: " + song.track);
                                console.log("Song title: " + song.title);
                                console.log("Song artists: " + song.artists);

                                let rl: any = readline.createInterface({
                                    input: process.stdin,
                                    output: process.stdout
                                });

                                rl.question("Update song " + (<number> index + 1) + "? (no) ", answer => {
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
                                                if (answer) {
                                                    song.artists = answer;
                                                }

                                                callback();
                                            });
                                        }, callback => {
                                            console.log("");

                                            rl.close();

                                            callback();
                                        }
                                    ], error => {
                                        if (error) {
                                            callback(error);
                                            return;
                                        }

                                        callback();
                                    });
                                });

                                if (options.yes) {
                                    rl.write("yes" + os.EOL);
                                } else if (options.no) {
                                    rl.write("no" + os.EOL);
                                }
                            }, error => {
                                if (error) {
                                    callback(error);
                                    return;
                                }

                                callback();
                            });
                        }
                    ], error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                async.eachOfSeries(albums, (album, index, callback) => {
                    let songs: Song[] = songsMap.get(album);

                    album.folder = path.join("Songs", album.language);

                    if (album.language === "English"
                        && songs.length == 1
                        && songs[0].track === "1"
                        && songs[0].title === album.title) {
                        album.folder = path.join(album.folder, "Singles");
                    }

                    album.folder = path.join(album.folder, album.date.substr(0, 4),
                        album.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim());

                    mkdirp(album.folder, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                let songDownloadCount: number = 0;

                async.eachOfSeries(albums, (album, index, callback) => {
                    let songs: Song[] = songsMap.get(album);

                    async.eachOfSeries(songs, (song, index, callback) => {
                        let songFile: string;

                        if (song.file) {
                            songFile = song.file;
                        }

                        song.file = path.join(album.folder, song.track + " - "
                            + song.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".mp3");

                        if (!songFile) {
                            let progressBar: ProgressBar = new ProgressBar("Downloading song "
                                + (songDownloadCount + 1) + "... [:bar] :percent :speedMBps :sizeMB :etas", {
                                total: 100,
                                width: 10,
                                incomplete: " "
                            });

                            let progress: any;

                            song.parser.parseFile(downloadProgress => {
                                progressBar.update(downloadProgress.percent, {
                                    speed: (downloadProgress.speed / 1024 / 1024).toFixed(1),
                                    size: (downloadProgress.size.transferred / 1024 / 1024).toFixed(1)
                                });

                                progress = downloadProgress;
                            })
                                .then(songParser => {
                                    progressBar.update(1, {
                                        speed: (0).toFixed(1),
                                        size: (progress.size.total / 1024 / 1024).toFixed(1)
                                    });

                                    songDownloadCount++;

                                    fs.writeFile(song.file, songParser.output.file, error => {
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
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    if (songDownloadCount > 0) {
                        console.log("");
                    }

                    callback();
                });
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                let songConvertCount: number = 0;

                async.eachOfSeries(albums, (album, index, callback) => {
                    let songs: Song[] = songsMap.get(album);

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

                            let tempSongFile: string = song.file.replace(".mp3", ".tmp");

                            fs.rename(song.file, tempSongFile, error => {
                                if (error) {
                                    callback(error);
                                    return;
                                }

                                let progressBar: ProgressBar = new ProgressBar("Converting song "
                                    + (songConvertCount + 1) + "... [:bar] :percent :sizeMB :etas", {
                                    total: 100,
                                    width: 10,
                                    incomplete: " "
                                });

                                let progress: any;

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

                                        songConvertCount++;

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
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    if (songConvertCount > 0) {
                        console.log("");
                    }

                    callback();
                });
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                async.eachOfSeries(albums, (album, index, callback) => {
                    let albumArt: string = album.art;

                    album.art = path.join(album.folder,
                        album.title.replace(/[\\/:*?"<>|.]/g, " ").replace(/\s+/g, " ").trim() + ".png");

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
                                    || image.bitmap.width !== 512
                                    || image.bitmap.height !== 512) {
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
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                for (let album of albums) {
                    let songs: Song[] = songsMap.get(album);

                    for (let song of songs) {
                        let id3: any = nodeID3v2.readTag(song.file, {
                            targetversion: 4
                        });

                        if (id3.iserror) {
                            id3 = nodeID3v2.createTag(song.file, {
                                targetversion: 4
                            });
                        }

                        id3.frames = [];

                        id3.addFrame("APIC", [album.art, 0x03]);
                        id3.addFrame("TALB", [album.title + "\u0000"]);
                        id3.addFrame("TCON", [album.language + "\u0000"]);
                        id3.addFrame("TDRC", [album.date.substr(0, 4) + "\u0000"]);
                        id3.addFrame("TDRL", [album.date + "\u0000"]);
                        id3.addFrame("TIT2", [song.title + "\u0000"]);
                        id3.addFrame("TLAN", [album.language + "\u0000"]);
                        id3.addFrame("TPE1", [song.artists + "\u0000"]);
                        id3.addFrame("TPE2", [album.artists + "\u0000"]);
                        id3.addFrame("TRCK", [song.track + "\u0000"]);

                        for (let id3Frame of id3.frames) {
                            if (id3Frame.type === "APIC") {
                                id3Frame.data.encoding = 0;
                            } else {
                                id3Frame.data.encoding = 3;
                            }
                        }

                        id3.write();
                    }
                }

                callback();
            }, callback => {
                let albums: Album[] = [...albumMap.values()];

                async.eachOfSeries(albums, (album, index, callback) => {
                    fs.unlink(album.art, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                if (!playlistFolder) {
                    callback();
                    return;
                }

                let albumFolders: string[] = [...new Set<string>(
                    [...songFileMap.values()].map(songFile => path.dirname(songFile)))];

                async.eachOfSeries(albumFolders, (albumFolder, index, callback) => {
                    rmdirp(albumFolder, error => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                }, error => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    callback();
                });
            }, callback => {
                console.log("Completed!");

                callback();
            }
        ], error => {
            if (error) {
                console.log(error);
            }
        });
    });

program.parse(process.argv);
