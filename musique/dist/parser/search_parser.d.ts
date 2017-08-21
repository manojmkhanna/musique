/// <reference types="bluebird" />
import { Parser } from "parsque";
import * as Promise from "bluebird";
import SearchInput from "../input/search_input";
import SearchOutput from "../output/search_output";
import SearchContent from "../content/search_content";
import Platform from "../platform/platform";
import SongOutput from "../output/song_output";
import SongParser from "./song_parser";
import AlbumOutput from "../output/album_output";
import AlbumParser from "./album_parser";
import ArtistOutput from "../output/artist_output";
import ArtistParser from "./artist_parser";
import PlaylistOutput from "../output/playlist_output";
import PlaylistParser from "./playlist_parser";
export default class SearchParser extends Parser<SearchInput, SearchOutput, SearchContent> {
    protected platform: Platform;
    constructor(platform: Platform);
    protected createInput(): Promise<SearchInput>;
    protected createOutput(): Promise<SearchOutput>;
    protected createContent(): Promise<SearchContent>;
    parse(): Promise<this>;
    protected createSongs(): Promise<SongOutput[]>;
    protected createAlbums(): Promise<AlbumOutput[]>;
    protected createArtists(): Promise<ArtistOutput[]>;
    protected createPlaylists(): Promise<PlaylistOutput[]>;
    parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parseArtists(outputsParser?: (childParser: ArtistParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parsePlaylists(outputsParser?: (childParser: PlaylistParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
}
