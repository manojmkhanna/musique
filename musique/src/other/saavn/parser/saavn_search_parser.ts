import * as Promise from "bluebird";
import * as request from "request-promise";
import * as cheerio from "cheerio";

import SearchParser from "../../../parser/search_parser";
import SongOutput from "../../../output/song_output";
import AlbumOutput from "../../../output/album_output";
import PlaylistOutput from "../../../output/playlist_output";
import SongParser from "../../../parser/song_parser";
import AlbumParser from "../../../parser/album_parser";
import PlaylistParser from "../../../parser/playlist_parser";
import SaavnConstants from "../saavn_constants";
import SongInput from "../../../input/song_input";
import AlbumInput from "../../../input/album_input";
import PlaylistInput from "../../../input/playlist_input";

export default class SaavnSearchParser extends SearchParser {
    private songPageHtmls: string[] = [];
    private albumPageHtmls: string[] = [];
    private playlistPageHtmls: string[] = [];

    protected contentCreated(): Promise<void> {
        return new Promise<void>(resolve => {
            this.input.songs = [];
            this.input.albums = [];
            this.input.playlists = [];

            resolve();
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

    protected createPlaylists(): Promise<PlaylistOutput[]> {
        return this.createPlaylistPage()
            .then(() => {
                let playlistOutputs = this.output.playlists;

                if (!playlistOutputs) {
                    playlistOutputs = [];
                }

                for (let playlistPageHtml of this.playlistPageHtmls) {
                    let $ = cheerio.load(playlistPageHtml);

                    $("h3>a").each((index, element) => {
                        let playlistOutput = playlistOutputs[index];

                        if (!playlistOutput) {
                            playlistOutput = new PlaylistOutput();
                        }

                        playlistOutput.url = $(element).attr("href");
                        playlistOutput.title = $(element).text();

                        playlistOutputs[index] = playlistOutput;
                    })
                }

                return playlistOutputs;
            });
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

    public parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>,
                       ...indexes: number[]): Promise<this> {
        let promise = new Promise<any>(resolve => {
            resolve();
        });

        if (indexes.length == 0) {
            promise = promise.then(() => this.createAlbumPage());
        } else {
            let lastIndex = indexes.sort()[indexes.length - 1];

            for (let i = this.albumPageHtmls.length; i <= Math.floor(lastIndex / 20) + 1; i++) {
                promise = promise.then(() => this.createAlbumPage());
            }
        }

        return promise.then(() => super.parseAlbums(outputsParser, ...indexes));
    }

    public parsePlaylists(outputsParser?: (childParser: PlaylistParser, index: number) => Promise<any>,
                          ...indexes: number[]): Promise<this> {
        let promise = new Promise<any>(resolve => {
            resolve();
        });

        if (indexes.length == 0) {
            promise = promise.then(() => this.createPlaylistPage());
        } else {
            let lastIndex = indexes.sort()[indexes.length - 1];

            for (let i = this.playlistPageHtmls.length; i <= Math.floor(lastIndex / 10) + 1; i++) {
                promise = promise.then(() => this.createPlaylistPage());
            }
        }

        return promise.then(() => super.parsePlaylists(outputsParser, ...indexes));
    }

    private createSongPage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            request.get("https://www.saavn.com/search/song/" + this.input.query
                + "?p=" + (this.songPageHtmls.length + 1), SaavnConstants.REQUEST_OPTIONS)
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

    private createAlbumPage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            request.get("https://www.saavn.com/search/album/" + this.input.query
                + "?p=" + (this.albumPageHtmls.length + 1), SaavnConstants.REQUEST_OPTIONS)
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

    private createPlaylistPage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            request.get("https://www.saavn.com/search/playlist/" + this.input.query
                + "?p=" + (this.playlistPageHtmls.length + 1), SaavnConstants.REQUEST_OPTIONS)
                .then(html => {
                    this.playlistPageHtmls.push(html);

                    let $ = cheerio.load(html);

                    $("h3>a").each((index, element) => {
                        let playlistInput = new PlaylistInput();
                        playlistInput.url = $(element).attr("href");

                        this.input.playlists.push(playlistInput);
                    });

                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
