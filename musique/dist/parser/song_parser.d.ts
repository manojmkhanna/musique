/// <reference types="bluebird" />
/// <reference types="node" />
import * as Promise from "bluebird";
import BaseParser from "./base_parser";
import SongInput from "../input/song_input";
import SongOutput from "../output/song_output";
import SongContent from "../content/song_content";
import AlbumOutput from "../output/album_output";
import ArtistOutput from "../output/artist_output";
import AlbumParser from "./album_parser";
import ArtistParser from "./artist_parser";
export default class SongParser extends BaseParser<SongInput, SongOutput, SongContent> {
    protected createInput(): Promise<SongInput>;
    protected createOutput(): Promise<SongOutput>;
    protected createContent(): Promise<SongContent>;
    parse(): Promise<this>;
    protected createDuration(): Promise<string>;
    protected createGenre(): Promise<string>;
    protected createLyrics(): Promise<string>;
    protected createMp3(): Promise<string>;
    protected createTitle(): Promise<string>;
    protected createTrack(): Promise<string>;
    protected createFile(progressCallback: (progress: any) => void): Promise<Buffer>;
    protected createAlbum(): Promise<AlbumOutput>;
    protected createArtists(): Promise<ArtistOutput[]>;
    parseDuration(): Promise<this>;
    parseGenre(): Promise<this>;
    parseLyrics(): Promise<this>;
    parseMp3(): Promise<this>;
    parseTitle(): Promise<this>;
    parseTrack(): Promise<this>;
    parseFile(progressCallback: (progress: any) => void): Promise<this>;
    parseAlbum(outputParser?: (childParser: AlbumParser) => Promise<any>): Promise<this>;
    parseArtists(outputsParser?: (childParser: ArtistParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
}
