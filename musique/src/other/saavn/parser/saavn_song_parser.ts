import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
import SaavnConstants from "../saavn_constants";
import AlbumInput from "../../../input/album_input";
import ArtistInput from "../../../input/artist_input";
import AlbumOutput from "../../../output/album_output";
import ArtistOutput from "../../../output/artist_output";

export default class SaavnSongParser extends SongParser {
    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>((resolve, reject) => {
            request.get(this.input.url, SaavnConstants.REQUEST_OPTIONS)
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
            let $ = cheerio.load(this.content.html);

            let albumInput = new AlbumInput();
            let artistInputs: ArtistInput[] = [];

            $("h2.page-subtitle>a").each((index, element) => {
                if (index == 0) {
                    albumInput.url = $(element).attr("href");
                } else {
                    let artistInput = new ArtistInput();
                    artistInput.url = $(element).attr("href").replace("-albums", "-artist");

                    artistInputs[index - 1] = artistInput;
                }
            });

            this.input.album = albumInput;
            this.input.artists = artistInputs;

            resolve();
        });
    }

    protected createDuration(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h2.page-subtitle").first().text().match(/ · (.+)$/)![1]);
        });
    }

    protected createLyrics(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            let lyrics = $("h2.page-subtitle:contains(Lyrics)+p").first().html();

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

            let cipher = crypto.createDecipheriv("des-ecb", "38346591", "");

            let buffer = Buffer.from(JSON.parse($("div.song-json").first().text()).url, "base64");
            buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);

            resolve("https://h.saavncdn.com" + buffer.toString().substr(10) + "_320.mp3");
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1.page-title").first().text().trim());
        });
    }

    protected createTrack(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            let $ = cheerio.load(this.content.html);

            let id = JSON.parse($("div.song-json").first().text()).songid;

            request.get(this.input.album.url, SaavnConstants.REQUEST_OPTIONS)
                .then(html => {
                    let $ = cheerio.load(html);

                    resolve(parseInt($("li.song-wrap[data-songid=" + id + "]>div.index").first().text()));
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    protected createAlbum(): Promise<AlbumOutput> {
        return new Promise<AlbumOutput>(resolve => {
            let $ = cheerio.load(this.content.html);

            let albumOutput = this.output.album;

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

            $("h2.page-subtitle>a").each((index, element) => {
                if (index > 0) {
                    let artistOutput = artistOutputs[index];

                    if (!artistOutput) {
                        artistOutput = new ArtistOutput();
                    }

                    artistOutput.url = $(element).attr("href").replace("-albums", "-artist");
                    artistOutput.title = $(element).text();

                    artistOutputs[index - 1] = artistOutput;
                }
            });

            resolve(artistOutputs);
        });
    }
}
