import * as Promise from "bluebird";
import * as request from "request";
import * as cheerio from "cheerio";
import * as moment from "moment";

import AlbumParser from "../../../parser/album_parser";
import AlbumContent from "../../../content/album_content";
import DeezerConstants from "../deezer_constants";
import ArtistInput from "../../../input/artist_input";
import SongInput from "../../../input/song_input";
import ArtistOutput from "../../../output/artist_output";
import SongOutput from "../../../output/song_output";

export default class DeezerAlbumParser extends AlbumParser {
    protected createContent(): Promise<AlbumContent> {
        return new Promise<AlbumContent>((resolve, reject) => {
            request(this.input.url, DeezerConstants.REQUEST_OPTIONS, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                let content = new AlbumContent();
                content.html = body;

                resolve(content);
            });
        });
    }

    protected contentCreated(): Promise<void> {
        return new Promise<void>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let artistInputs: ArtistInput[] = [];

            for (let i = 0; i < json.DATA.ARTISTS.length; i++) {
                let artistInput = new ArtistInput();
                artistInput.url = "http://www.deezer.com/en/artist/" + json.DATA.ARTISTS[i].ART_ID;

                artistInputs[i] = artistInput;
            }

            this.input.artists = artistInputs;

            let songInputs: SongInput[] = [];

            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songInput = new SongInput();
                songInput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;

                songInputs[i] = songInput;
            }

            this.input.songs = songInputs;

            resolve();
        });
    }

    protected createArt(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("img#naboo_album_image").first().attr("src").replace("200x200", "512x512"));
        });
    }

    protected createDate(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve(moment($("span#naboo_album_head_style")
                .first().text().match(/\| (.+?)\t+/)![1], "DD-MM-YYYY").format("YYYY-MM-DD"));
        });
    }

    protected createLabel(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("div.naboo-album-label").first().text().match(/\| \t+(.+?)\t+/)![1]);
        });
    }

    protected createLanguage(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve("English");
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1#naboo_album_title").first().text().trim());
        });
    }

    protected createYear(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("div.naboo-album-label").first().text().match(/\t+(\d+?) \|/)![1]);
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

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            let json = JSON.parse(this.content.html.match(/__DZR_APP_STATE__ = (.+?)</)![1]);

            let songOutputs: SongOutput[] = this.output.songs;

            if (!songOutputs) {
                songOutputs = [];
            }

            for (let i = 0; i < json.SONGS.data.length; i++) {
                let songOutput = songOutputs[i];

                if (!songOutput) {
                    songOutput = new SongOutput();
                }

                songOutput.url = "http://www.deezer.com/en/track/" + json.SONGS.data[i].SNG_ID;
                songOutput.title = json.SONGS.data[i].SNG_TITLE;

                songOutputs[i] = songOutput;
            }

            resolve(songOutputs);
        });
    }
}
