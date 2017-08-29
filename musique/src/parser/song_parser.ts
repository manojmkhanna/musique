import * as Promise from "bluebird";

import BaseParser from "./base_parser";
import SongInput from "../input/song_input";
import SongOutput from "../output/song_output";
import SongContent from "../content/song_content";
import AlbumOutput from "../output/album_output";
import AlbumParser from "./album_parser";
import ArtistOutput from "../output/artist_output";
import ArtistParser from "./artist_parser";

export default class SongParser extends BaseParser<SongInput, SongOutput, SongContent> {
    protected createInput(): Promise<SongInput> {
        return new Promise<SongInput>(resolve => {
            resolve(new SongInput());
        });
    }

    protected createOutput(): Promise<SongOutput> {
        return new Promise<SongOutput>(resolve => {
            resolve(new SongOutput());
        });
    }

    protected createContent(): Promise<SongContent> {
        return new Promise<SongContent>(resolve => {
            resolve(new SongContent());
        });
    }

    public parse(): Promise<this> {
        return super.parse()
            .then(() => this.parseDuration())
            .then(() => this.parseGenre())
            .then(() => this.parseLyrics())
            .then(() => this.parseMp3())
            .then(() => this.parseTitle())
            .then(() => this.parseTrack())
            .then(() => this.parseAlbum())
            .then(() => this.parseArtists());
    }

    protected createDuration(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createGenre(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createLyrics(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createMp3(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createTrack(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createAlbum(): Promise<AlbumOutput> {
        return new Promise<AlbumOutput>(resolve => {
            resolve();
        });
    }

    protected createArtists(): Promise<ArtistOutput[]> {
        return new Promise<ArtistOutput[]>(resolve => {
            resolve();
        });
    }

    public parseDuration(): Promise<this> {
        return this.parseValue("duration", () => this.createDuration());
    }

    public parseGenre(): Promise<this> {
        return this.parseValue("genre", () => this.createGenre());
    }

    public parseLyrics(): Promise<this> {
        return this.parseValue("lyrics", () => this.createLyrics());
    }

    public parseMp3(): Promise<this> {
        return this.parseValue("mp3", () => this.createMp3());
    }

    public parseTitle(): Promise<this> {
        return this.parseValue("title", () => this.createTitle());
    }

    public parseTrack(): Promise<this> {
        return this.parseValue("track", () => this.createTrack());
    }

    public parseAlbum(outputParser?: (childParser: AlbumParser) => Promise<any>): Promise<this> {
        if (outputParser == undefined) {
            return this.parseValue("album", () => this.createAlbum());
        } else {
            return this.parseOutput("album", () => new Promise<AlbumParser>(resolve => {
                resolve(this.platform.createAlbumParser());
            }), outputParser);
        }
    }

    public parseArtists(outputsParser?: (childParser: ArtistParser, index: number) => Promise<any>,
                        ...indexes: number[]): Promise<this> {
        if (outputsParser == undefined) {
            return this.parseValue("artists", () => this.createArtists());
        } else {
            return this.parseOutputs("artists", () => new Promise<ArtistParser>(resolve => {
                resolve(this.platform.createArtistParser());
            }), outputsParser, ...indexes);
        }
    }
}
