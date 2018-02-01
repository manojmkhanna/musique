import {Parser} from "parsque";
import * as Promise from "bluebird";

import SearchInput from "../input/search_input";
import SearchOutput from "../output/search_output";
import SearchContent from "../content/search_content";
import Platform from "../platform/platform";
import SongOutput from "../output/song_output";
import AlbumOutput from "../output/album_output";
import ArtistOutput from "../output/artist_output";
import PlaylistOutput from "../output/playlist_output";
import SongParser from "./song_parser";
import AlbumParser from "./album_parser";
import ArtistParser from "./artist_parser";
import PlaylistParser from "./playlist_parser";

export default class SearchParser extends Parser<SearchInput, SearchOutput, SearchContent> {
    public constructor(protected readonly platform: Platform) {
        super();
    }

    protected createInput(): Promise<SearchInput> {
        return new Promise<SearchInput>(resolve => {
            resolve(new SearchInput());
        });
    }

    protected createOutput(): Promise<SearchOutput> {
        return new Promise<SearchOutput>(resolve => {
            resolve(new SearchOutput());
        });
    }

    protected createContent(): Promise<SearchContent> {
        return new Promise<SearchContent>(resolve => {
            resolve(new SearchContent());
        });
    }

    public parse(): Promise<this> {
        return this.parseSongs()
            .then(() => this.parseAlbums())
            .then(() => this.parseArtists())
            .then(() => this.parsePlaylists());
    }

    protected createSongs(): Promise<SongOutput[]> {
        return new Promise<SongOutput[]>(resolve => {
            resolve();
        });
    }

    protected createAlbums(): Promise<AlbumOutput[]> {
        return new Promise<AlbumOutput[]>(resolve => {
            resolve();
        });
    }

    protected createArtists(): Promise<ArtistOutput[]> {
        return new Promise<ArtistOutput[]>(resolve => {
            resolve();
        });
    }

    protected createPlaylists(): Promise<PlaylistOutput[]> {
        return new Promise<PlaylistOutput[]>(resolve => {
            resolve();
        });
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

    public parseArtists(outputsParser?: (childParser: ArtistParser, index: number) => Promise<any>,
                        ...indexes: number[]): Promise<this> {
        if (!outputsParser) {
            return this.parseValue("artists", () => this.createArtists());
        } else {
            return this.parseOutputs("artists", () => new Promise<ArtistParser>(resolve => {
                resolve(this.platform.createArtistParser());
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
