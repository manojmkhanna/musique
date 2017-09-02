/// <reference types="bluebird" />
import * as Promise from "bluebird";
import BaseParser from "./base_parser";
import AlbumInput from "../input/album_input";
import AlbumOutput from "../output/album_output";
import AlbumContent from "../content/album_content";
import ArtistOutput from "../output/artist_output";
import SongOutput from "../output/song_output";
import ArtistParser from "./artist_parser";
import SongParser from "./song_parser";
export default class AlbumParser extends BaseParser<AlbumInput, AlbumOutput, AlbumContent> {
    protected createInput(): Promise<AlbumInput>;
    protected createOutput(): Promise<AlbumOutput>;
    protected createContent(): Promise<AlbumContent>;
    parse(): Promise<this>;
    protected createArt(): Promise<string>;
    protected createDate(): Promise<string>;
    protected createLabel(): Promise<string>;
    protected createLanguage(): Promise<string>;
    protected createTitle(): Promise<string>;
    protected createYear(): Promise<string>;
    protected createArtists(): Promise<ArtistOutput[]>;
    protected createSongs(): Promise<SongOutput[]>;
    parseArt(): Promise<this>;
    parseDate(): Promise<this>;
    parseLabel(): Promise<this>;
    parseLanguage(): Promise<this>;
    parseTitle(): Promise<this>;
    parseYear(): Promise<this>;
    parseArtists(outputsParser?: (childParser: ArtistParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
}
