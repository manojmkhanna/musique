/// <reference types="bluebird" />
import * as Promise from "bluebird";
import SearchParser from "../../../parser/search_parser";
import SongOutput from "../../../output/song_output";
import AlbumOutput from "../../../output/album_output";
import PlaylistOutput from "../../../output/playlist_output";
import SongParser from "../../../parser/song_parser";
import AlbumParser from "../../../parser/album_parser";
import PlaylistParser from "../../../parser/playlist_parser";
export default class SaavnSearchParser extends SearchParser {
    private songPageHtmls;
    private albumPageHtmls;
    private playlistPageHtmls;
    protected contentCreated(): Promise<void>;
    protected createSongs(): Promise<SongOutput[]>;
    protected createAlbums(): Promise<AlbumOutput[]>;
    protected createPlaylists(): Promise<PlaylistOutput[]>;
    parseSongs(outputsParser?: (childParser: SongParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parseAlbums(outputsParser?: (childParser: AlbumParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    parsePlaylists(outputsParser?: (childParser: PlaylistParser, index: number) => Promise<any>, ...indexes: number[]): Promise<this>;
    private createSongPage();
    private createAlbumPage();
    private createPlaylistPage();
}
