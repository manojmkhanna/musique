import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
import DeezerConstants from "../deezer_constants";
import AlbumInput from "../../../input/album_input";
import ArtistInput from "../../../input/artist_input";
import AlbumOutput from "../../../output/album_output";
import ArtistOutput from "../../../output/artist_output";

export default class DeezerSongParser extends SongParser {
    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>((resolve, reject) => {
            request.get(this.input.url, DeezerConstants.REQUEST_OPTIONS)
                .then(html => {
                    let content = new SongContent();
                    content.html = html;

                    resolve(content);
                })
                .catch(error => {
                    reject(error);
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

            for (let i = 1; i < json.DATA.ARTISTS.length; i++) {
                let artistInput = new ArtistInput();
                artistInput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;

                artistInputs.push(artistInput);
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

            let mp3 = json.DATA.MD5_ORIGIN + "¤3¤" + json.DATA.SNG_ID + "¤" + json.DATA.MEDIA_VERSION;
            mp3 = crypto.createHash("md5").update(mp3, "ascii").digest("hex") + "¤" + mp3 + "¤";

            while (mp3.length % 16 > 0) {
                mp3 += " ";
            }

            mp3 = "http://e-cdn-proxy-0.deezer.com/mobile/1/"
                + crypto.createCipheriv("aes-128-ecb", "jo6aey6haid2Teih", "").update(mp3, "ascii", "hex");

            resolve(mp3);
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

            for (let i = 1; i < json.DATA.ARTISTS.length; i++) {
                let artistOutput = artistOutputs[i];

                if (!artistOutput) {
                    artistOutput = new ArtistOutput();
                }

                artistOutput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;
                artistOutput.title = json.DATA.ARTISTS[i].ART_NAME;

                artistOutputs[i - 1] = artistOutput;
            }

            resolve(artistOutputs);
        });
    }
}
