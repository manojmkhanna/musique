/// <reference types="bluebird" />
import * as Promise from "bluebird";
import BaseParser from "./base_parser";
import ArtistInput from "../input/artist_input";
import ArtistOutput from "../output/artist_output";
import ArtistContent from "../content/artist_content";
import AlbumOutput from "../output/album_output";
import AlbumParser from "./album_parser";
import SongOutput from "../output/song_output";
import SongParser from "./song_parser";
export default class ArtistParser extends BaseParser<ArtistInput, ArtistOutput, ArtistContent> {
    protected createInput(): Promise<ArtistInput>;
    protected createOutput(): Promise<ArtistOutput>;
    protected createContent(): Promise<ArtistContent>;
    parse(): Promise<this>;
    protected createTitle(): Promise<string>;
    protected createAlbums(): Promise<AlbumOutput[]>;
    protected createSongs(): Promise<SongOutput[]>;
    parseTitle(): Promise<this>;
    parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
}
