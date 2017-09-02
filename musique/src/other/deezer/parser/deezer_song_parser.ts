import * as Promise from "bluebird";
import * as request from "request";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
import DeezerConstants from "../deezer_constants";
import AlbumInput from "../../../input/album_input";
import ArtistInput from "../../../input/artist_input";
import AlbumOutput from "../../../output/album_output";
import ArtistOutput from "../../../output/artist_output";

const progress = require("request-progress");

export default class DeezerSongParser extends SongParser {
    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>((resolve, reject) => {
            request(this.input.url, DeezerConstants.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let content = new SongContent();
                content.html = body;

                resolve(content);
            });
        });
    }

    protected contentCreated(): Promise<void> {
        return new Promise<void>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let albumInput = new AlbumInput();
            albumInput.url = "http://www.deezer.com/en/album/" + json.DATA.ALB_ID;

            this.input.album = albumInput;

            let artistInputs: ArtistInput[] = [];

            for (let i = 0; i < json.DATA.ARTISTS.length; i++) {
                let artistInput = new ArtistInput();
                artistInput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;

                artistInputs[i] = artistInput;
            }

            this.input.artists = artistInputs;

            resolve();
        });
    }

    protected createDuration(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("div.naboo_track_song").last().text().match(/Length : 0*(\d+:\d+)/)![1]);
        });
    }

    protected createLyrics(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("div:contains(Lyrics)+div").first().text());
        });
    }

    protected createMp3(): Promise<string> {
        return new Promise<string>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let hash = json.DATA.MD5_ORIGIN + "¤3¤" + json.DATA.SNG_ID + "¤" + json.DATA.MEDIA_VERSION;

            let hashMd5 = crypto.createHash("md5").update(new Buffer(hash, "binary")).digest("hex");

            hash = hashMd5 + "¤" + hash + "¤";

            let cipher = crypto.createCipheriv("aes-128-ecb", "jo6aey6haid2Teih", "");

            resolve("http://e-cdn-proxy-" + json.DATA.MD5_ORIGIN.substr(0, 1)
                + ".deezer.com/mobile/1/" + cipher.update(hash, "binary", "hex") + cipher.final("hex"));
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1#naboo_track_title").first().text().trim());
        });
    }

    protected createTrack(): Promise<string> {
        return new Promise<string>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            resolve(json.DATA.TRACK_NUMBER);
        });
    }

    protected createFile(progressCallback: (state: object) => void): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let hash = json.DATA.MD5_ORIGIN + "¤3¤" + json.DATA.SNG_ID + "¤" + json.DATA.MEDIA_VERSION;

            let hashMd5 = crypto.createHash("md5").update(new Buffer(hash, "binary")).digest("hex");

            hash = hashMd5 + "¤" + hash + "¤";

            let cipher = crypto.createCipheriv("aes-128-ecb", "jo6aey6haid2Teih", "");

            let mp3 = "http://e-cdn-proxy-" + json.DATA.MD5_ORIGIN.substr(0, 1)
                + ".deezer.com/mobile/1/" + cipher.update(hash, "binary", "hex") + cipher.final("hex");

            progress(request(mp3, {
                encoding: null
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let keyMd5 = crypto.createHash("md5").update(json.DATA.SNG_ID).digest("hex");

                let key = "";

                for (let i = 0; i < 16; i++) {
                    key += String.fromCharCode(keyMd5.charCodeAt(i)
                        ^ keyMd5.charCodeAt(i + 16) ^ "g4el58wc0zvf9na1".charCodeAt(i));
                }

                for (let i = 0; i * 2048 < body.length; i++) {
                    if (i % 3 == 0) {
                        let cipher = crypto.createDecipheriv("bf-cbc", key, "\x00\x01\x02\x03\x04\x05\x06\x07");
                        cipher.setAutoPadding(false);

                        let buffer = Buffer.alloc(2048);

                        body.copy(buffer, 0, i * 2048, i * 2048 + 2048);

                        buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);

                        buffer.copy(body, i * 2048, 0, buffer.length);
                    }
                }

                resolve(body);
            }), {
                throttle: 33
            })
                .on("progress", (state: object) => {
                    progressCallback(state);
                });
        });
    }

    protected createAlbum(): Promise<AlbumOutput> {
        return new Promise<AlbumOutput>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let albumOutput = this.output.album;

            if (!albumOutput) {
                albumOutput = new AlbumOutput();
            }

            albumOutput.url = "http://www.deezer.com/en/album/" + json.DATA.ALB_ID;
            albumOutput.title = json.DATA.ALB_TITLE;

            resolve(albumOutput);
        });
    }

    protected createArtists(): Promise<ArtistOutput[]> {
        return new Promise<ArtistOutput[]>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let artistOutputs: ArtistOutput[] = this.output.artists;

            if (!artistOutputs) {
                artistOutputs = [];
            }

            for (let i = 0; i < json.DATA.ARTISTS.length; i++) {
                let artistOutput = artistOutputs[i];

                if (!artistOutput) {
                    artistOutput = new ArtistOutput();
                }

                artistOutput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistOutput.title = json.DATA.ARTISTS[i].ART_NAME;

                artistOutputs[i] = artistOutput;
            }

            resolve(artistOutputs);
        });
    }
}
