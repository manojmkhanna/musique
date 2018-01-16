import * as Promise from "bluebird";
import * as request from "request";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
import SaavnConstants from "../saavn_constants";
import AlbumInput from "../../../input/album_input";
import ArtistInput from "../../../input/artist_input";
import AlbumContent from "../../../content/album_content";
import AlbumOutput from "../../../output/album_output";
import ArtistOutput from "../../../output/artist_output";

const progress = require("request-progress");

export default class SaavnSongParser extends SongParser {
    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>((resolve, reject) => {
            request(this.input.url, SaavnConstants.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let content: SongContent = new SongContent();
                content.html = body;

                resolve(content);
            });
        });
    }

    protected contentCreated(): Promise<void> {
        return new Promise<void>(resolve => {
            let $ = cheerio.load(this.content.html);

            let albumInput: AlbumInput = new AlbumInput();
            albumInput.url = $("h2.page-subtitle>a").first().attr("href");

            this.input.album = albumInput;

            let artistInputs: ArtistInput[] = [];

            $("h4:contains(Singers)+p>a").each((index, element) => {
                let artistInput: ArtistInput = new ArtistInput();
                artistInput.url = $(element).attr("href").replace("-albums", "-artist");

                artistInputs[index] = artistInput;
            });

            this.input.artists = artistInputs;

            resolve();
        });
    }

    protected createDuration(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h2.page-subtitle").first().text().match(/ · (.+)/)![1]);
        });
    }

    protected createLyrics(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            let lyrics: string | null = $("h2.page-subtitle:contains(Lyrics)+p").first().html();

            if (lyrics) {
                resolve(lyrics.replace(/(<br>){2,}/g, "\n\n").replace(/<br>/g, "\n"));
            } else {
                resolve();
            }
        });
    }

    protected createMp3(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            let hash: string = JSON.parse($("div.song-json").first().text()).url;

            let cipher = crypto.createDecipheriv("des-ecb", "38346591", "");

            hash = cipher.update(hash, "base64", "ascii") + cipher.final("ascii");

            resolve("https://h.saavncdn.com" + hash.substr(10) + ".mp3");
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1.page-title").first().text().trim());
        });
    }

    protected createTrack(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let $ = cheerio.load(this.content.html);

            let id: string = JSON.parse($("div.song-json").first().text()).songid;

            request(this.input.album.url, SaavnConstants.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let albumContent: AlbumContent = new AlbumContent();
                albumContent.html = body;

                this.content.album = albumContent;

                let $ = cheerio.load(body);

                resolve($("li.song-wrap[data-songid=" + id + "]>div.index").first().text());
            });
        });
    }

    protected createFile(progressCallback: (progress: any) => void): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let $ = cheerio.load(this.content.html);

            let hash: string = JSON.parse($("div.song-json").first().text()).url;

            let cipher = crypto.createDecipheriv("des-ecb", "38346591", "");

            hash = cipher.update(hash, "base64", "ascii") + cipher.final("ascii");

            let mp3: string = "https://h.saavncdn.com" + hash.substr(10) + "_320.mp3";

            progress(request(mp3, {
                encoding: null
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (response.statusCode == 403) {
                    progress(request(mp3.replace("_320", ""), {
                        encoding: null
                    }, (error, response, body) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(body);
                    }), {
                        throttle: 16
                    })
                        .on("progress", (state: object) => {
                            progressCallback(state);
                        });

                    return;
                }

                resolve(body);
            }), {
                throttle: 16
            })
                .on("progress", (state: object) => {
                    progressCallback(state);
                });
        });
    }

    protected createAlbum(): Promise<AlbumOutput> {
        return new Promise<AlbumOutput>(resolve => {
            let $ = cheerio.load(this.content.html);

            let albumOutput: AlbumOutput = this.output.album;

            if (!albumOutput) {
                albumOutput = new AlbumOutput();
            }

            let element = $("h2.page-subtitle>a").first();

            albumOutput.url = element.attr("href");
            albumOutput.title = element.text();

            resolve(albumOutput);
        });
    }

    protected createArtists(): Promise<ArtistOutput[]> {
        return new Promise<ArtistOutput[]>(resolve => {
            let $ = cheerio.load(this.content.html);

            let artistOutputs: ArtistOutput[] = this.output.artists;

            if (!artistOutputs) {
                artistOutputs = [];
            }

            $("h4:contains(Singers)+p>a").each((index, element) => {
                let artistOutput: ArtistOutput = artistOutputs[index];

                if (!artistOutput) {
                    artistOutput = new ArtistOutput();
                }

                artistOutput.url = $(element).attr("href").replace("-albums", "-artist");
                artistOutput.title = $(element).text();

                artistOutputs[index] = artistOutput;
            });

            resolve(artistOutputs);
        });
    }
}
