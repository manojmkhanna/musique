import * as Promise from "bluebird";
import ArtistContent from "../content/artist_content";
import ArtistInput from "../input/artist_input";
import AlbumOutput from "../output/album_output";
import ArtistOutput from "../output/artist_output";
import PlaylistOutput from "../output/playlist_output";
import SongOutput from "../output/song_output";
import AlbumParser from "./album_parser";
import BaseParser from "./base_parser";
import PlaylistParser from "./playlist_parser";
import SongParser from "./song_parser";

export default class ArtistParser extends BaseParser<ArtistInput, ArtistOutput, ArtistContent> {
    protected createInput(): Promise<ArtistInput> {
        return new Promise<ArtistInput>(resolve => {
            resolve(new ArtistInput());
        });
    }

    protected createOutput(): Promise<ArtistOutput> {
        return new Promise<ArtistOutput>(resolve => {
            resolve(new ArtistOutput());
        });
    }

    protected createContent(): Promise<ArtistContent> {
        return new Promise<ArtistContent>(resolve => {
            resolve(new ArtistContent());
        });
    }

    public parse(): Promise<this> {
        return super.parse()
            .then(() => this.parseTitle())
            .then(() => this.parseAlbums())
            .then(() => this.parseSongs());
    }

    protected createTitle(): Promise<string> {
        return new Promise<string>(resolve => {
            resolve();
        });
    }

    protected createAlbums(): Promise<AlbumOutput[]> {
        return new Promise<AlbumOutput[]>(resolve => {
            resolve();
        });
    }

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            resolve();
        });
    }

    protected createPlaylists(): Promise<PlaylistOutput[]> {
        return new Promise<PlaylistOutput[]>(resolve => {
            resolve();
        });
    }

    public parseTitle(): Promise<this> {
        return this.parseValue("title", () => this.createTitle());
    }

    public parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>,
                       ...indexes: number[]): Promise<this> {
        if (!outputsParser) {
            return this.parseValue("albums", () => this.createAlbums());
        } else {
            return this.parseOutputs("albums", () => new Promise<AlbumParser>(resolve => {
                resolve(this.platform.createAlbumParser());
            }), outputsParser, ...indexes);
        }
    }

    public parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>,
                      ...indexes: number[]): Promise<this> {
        if (!outputsParser) {
            return this.parseValue("songs", () => this.createSongs());
        } else {
            return this.parseOutputs("songs", () => new Promise<SongParser>(resolve => {
                resolve(this.platform.createSongParser());
            }), outputsParser, ...indexes);
        }
    }

    public parsePlaylists(outputsParser?: (childParser: PlaylistParser, index: number) => Promise<any>,
                          ...indexes: number[]): Promise<this> {
        if (!outputsParser) {
            return this.parseValue("playlists", () => this.createPlaylists());
        } else {
            return this.parseOutputs("playlists", () => new Promise<PlaylistParser>(resolve => {
                resolve(this.platform.createPlaylistParser());
            }), outputsParser, ...indexes);
        }
    }
}
