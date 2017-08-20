/// <reference types="bluebird" />
import * as Promise from "bluebird";
import BaseParser from "./base_parser";
import SongInput from "../input/song_input";
import SongOutput from "../output/song_output";
import SongContent from "../content/song_content";
import AlbumOutput from "../output/album_output";
import ArtistOutput from "../output/artist_output";
export default class SongParser extends BaseParser<SongInput, SongOutput, SongContent> {
    parse(): Promise<this>;
    parseDuration(): Promise<this>;
    parseGenre(): Promise<this>;
    parseLyrics(): Promise<this>;
    parseMp3(): Promise<this>;
    parseRating(): Promise<this>;
    parseTitle(): Promise<this>;
    parseTrack(): Promise<this>;
    parseAlbum(outputParser?: (childParser: this) => Promise<any>): Promise<this>;
    parseArtists(): Promise<this>;
    protected createInput(): Promise<SongInput>;
    protected createOutput(): Promise<SongOutput>;
    protected createContent(): Promise<SongContent>;
    protected createDuration(): Promise<string>;
    protected createGenre(): Promise<string>;
    protected createLyrics(): Promise<string>;
    protected createMp3(): Promise<string>;
    protected createRating(): Promise<number>;
    protected createTitle(): Promise<string>;
    protected createTrack(): Promise<number>;
    protected createAlbum(): Promise<AlbumOutput>;
    protected createArtists(): Promise<ArtistOutput[]>;
}
