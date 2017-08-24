/// <reference types="bluebird" />
import * as Promise from "bluebird";
import ArtistParser from "../../../parser/artist_parser";
import ArtistContent from "../../../content/artist_content";
import AlbumOutput from "../../../output/album_output";
import SongOutput from "../../../output/song_output";
import AlbumParser from "../../../parser/album_parser";
import SongParser from "../../../parser/song_parser";
export default class SaavnArtistParser extends ArtistParser {
    private albumPageHtmls;
    private songPageHtmls;
    protected createContent(): Promise<ArtistContent>;
    protected contentCreated(): Promise<void>;
    protected createTitle(): Promise<string>;
    protected createAlbums(): Promise<AlbumOutput[]>;
    protected createSongs(): Promise<SongOutput[]>;
    parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    private createAlbumPage();
    private createSongPage();
}
