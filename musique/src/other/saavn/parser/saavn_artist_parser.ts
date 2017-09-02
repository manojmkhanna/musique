import * as Promise from "bluebird";
import * as rp from "request-promise";
import * as cheerio from "cheerio";

import ArtistParser from "../../../parser/artist_parser";
import ArtistContent from "../../../content/artist_content";
import SaavnConstants from "../saavn_constants";
import AlbumOutput from "../../../output/album_output";
import SongOutput from "../../../output/song_output";
import AlbumParser from "../../../parser/album_parser";
import SongParser from "../../../parser/song_parser";
import AlbumInput from "../../../input/album_input";
import SongInput from "../../../input/song_input";

export default class SaavnArtistParser extends ArtistParser {
    private albumPageHtmls: string[] = [];
    private songPageHtmls: string[] = [];

    protected createContent(): Promise<ArtistContent> {
        return new Promise<ArtistContent>((resolve, reject) => {
            rp.get(this.input.url, SaavnConstants.REQUEST_OPTIONS)
                .then(html => {
                    let content = new ArtistContent();
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
            this.input.albums = [];
            this.input.songs = [];

            resolve();
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            let $ = cheerio.load(this.content.html);

            resolve($("h1.page-title").first().text());
        });
    }

    protected createAlbums(): Promise<AlbumOutput[]> {
        return this.createAlbumPage()
            .then(() => {
                let albumOutputs = this.output.albums;

                if (!albumOutputs) {
                    albumOutputs = [];
                }

                for (let albumPageHtml of this.albumPageHtmls) {
                    let $ = cheerio.load(albumPageHtml);

                    $("h3.title>a").each((index, element) => {
                        let albumOutput = albumOutputs[index];

                        if (!albumOutput) {
                            albumOutput = new AlbumOutput();
                        }

                        albumOutput.url = $(element).attr("href");
                        albumOutput.title = $(element).text();

                        albumOutputs[index] = albumOutput;
                    })
                }

                return albumOutputs;
            });
    }

    protected createSongs(): Promise<SongOutput[]> {
        return this.createSongPage()
            .then(() => {
                let songOutputs = this.output.songs;

                if (!songOutputs) {
                    songOutputs = [];
                }

                for (let songPageHtml of this.songPageHtmls) {
                    let $ = cheerio.load(songPageHtml);

                    $("span.title>a").each((index, element) => {
                        let songOutput = songOutputs[index];

                        if (!songOutput) {
                            songOutput = new SongOutput();
                        }

                        songOutput.url = $(element).attr("href");
                        songOutput.title = $(element).text();

                        songOutputs[index] = songOutput;
                    })
                }

                return songOutputs;
            });
    }

    public parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>,
                       ...indexes: number[]): Promise<this> {
        let promise = new Promise<any>(resolve => {
            resolve();
        });

        if (indexes.length == 0) {
            promise = promise.then(() => this.createAlbumPage());
        } else {
            let lastIndex = indexes.sort()[indexes.length - 1];

            for (let i = this.albumPageHtmls.length; i <= Math.floor(lastIndex / 12) + 1; i++) {
                promise = promise.then(() => this.createAlbumPage());
            }
        }

        return promise.then(() => super.parseAlbums(outputsParser, ...indexes));
    }

    public parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>,
                      ...indexes: number[]): Promise<this> {
        let promise = new Promise<any>(resolve => {
            resolve();
        });

        if (indexes.length == 0) {
            promise = promise.then(() => this.createSongPage());
        } else {
            let lastIndex = indexes.sort()[indexes.length - 1];

            for (let i = this.songPageHtmls.length; i <= Math.floor(lastIndex / 10) + 1; i++) {
                promise = promise.then(() => this.createSongPage());
            }
        }

        return promise.then(() => super.parseSongs(outputsParser, ...indexes));
    }

    private createAlbumPage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            rp.get(this.input.url.replace("-artist", "-albums")
                + "?page=" + this.albumPageHtmls.length, SaavnConstants.REQUEST_OPTIONS)
                .then(html => {
                    this.albumPageHtmls.push(html);

                    let $ = cheerio.load(html);

                    $("h3.title>a").each((index, element) => {
                        let albumInput = new AlbumInput();
                        albumInput.url = $(element).attr("href");

                        this.input.albums.push(albumInput);
                    });

                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    private createSongPage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            rp.get(this.input.url.replace("-artist", "-songs")
                + "?page=" + this.songPageHtmls.length, SaavnConstants.REQUEST_OPTIONS)
                .then(html => {
                    this.songPageHtmls.push(html);

                    let $ = cheerio.load(html);

                    $("span.title>a").each((index, element) => {
                        let songInput = new SongInput();
                        songInput.url = $(element).attr("href");

                        this.input.songs.push(songInput);
                    });

                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
