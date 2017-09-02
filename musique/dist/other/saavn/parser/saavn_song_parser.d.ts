/// <reference types="bluebird" />
/// <reference types="node" />
import * as Promise from "bluebird";
import SongParser from "../../../parser/song_parser";
import SongContent from "../../../content/song_content";
import AlbumOutput from "../../../output/album_output";
import ArtistOutput from "../../../output/artist_output";
export default class SaavnSongParser extends SongParser {
    protected createContent(): Promise<SongContent>;
    protected contentCreated(): Promise<void>;
    protected createDuration(): Promise<string>;
    protected createLyrics(): Promise<string>;
    protected createMp3(): Promise<string>;
    protected createTitle(): Promise<string>;
    protected createTrack(): Promise<string>;
    protected createFile(): Promise<Buffer>;
    protected createAlbum(): Promise<AlbumOutput>;
    protected createArtists(): Promise<ArtistOutput[]>;
}
