/// <reference types="bluebird" />
import * as Promise from "bluebird";
import AlbumParser from "../../../parser/album_parser";
import AlbumContent from "../../../content/album_content";
import ArtistOutput from "../../../output/artist_output";
import SongOutput from "../../../output/song_output";
export default class SaavnAlbumParser extends AlbumParser {
    protected createContent(): Promise<AlbumContent>;
    protected contentCreated(): Promise<any>;
    protected createArt(): Promise<string>;
    protected createDuration(): Promise<string>;
    protected createLabel(): Promise<string>;
    protected createLanguage(): Promise<string>;
    protected createReleased(): Promise<string>;
    protected createTitle(): Promise<string>;
    protected createArtists(): Promise<ArtistOutput[]>;
    protected createSongs(): Promise<SongOutput[]>;
}
