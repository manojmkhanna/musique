import * as Promise from "bluebird";
import AlbumContent from "./content/album_content";
import ArtistContent from "./content/artist_content";
import PlaylistContent from "./content/playlist_content";
import SearchContent from "./content/search_content";
import SongContent from "./content/song_content";
import AlbumInput from "./input/album_input";
import ArtistInput from "./input/artist_input";
import PlaylistInput from "./input/playlist_input";
import SearchInput from "./input/search_input";
import SongInput from "./input/song_input";
import AlbumOutput from "./output/album_output";
import ArtistOutput from "./output/artist_output";
import PlaylistOutput from "./output/playlist_output";
import SearchOutput from "./output/search_output";
import SongOutput from "./output/song_output";
import AlbumParser from "./parser/album_parser";
import ArtistParser from "./parser/artist_parser";
import PlaylistParser from "./parser/playlist_parser";
import SearchParser from "./parser/search_parser";
import SongParser from "./parser/song_parser";
import Platforms from "./platform/platforms";

export {
    SongInput, SongOutput, SongContent, SongParser,
    AlbumInput, AlbumOutput, AlbumContent, AlbumParser,
    ArtistInput, ArtistOutput, ArtistContent, ArtistParser,
    PlaylistInput, PlaylistOutput, PlaylistContent, PlaylistParser,
    SearchInput, SearchOutput, SearchContent, SearchParser
};

let platforms: Platforms = new Platforms();

export function parseSong(platformName: keyof Platforms,
                          url: string): Promise<SongParser> {
    return platforms[platformName].createSongParser()
        .create(() => new Promise<SongInput>(resolve => {
            let input: SongInput = new SongInput();
            input.url = url;

            resolve(input);
        }));
}

export function parseAlbum(platformName: keyof Platforms,
                           url: string): Promise<AlbumParser> {
    return platforms[platformName].createAlbumParser()
        .create(() => new Promise<AlbumInput>(resolve => {
            let input: AlbumInput = new AlbumInput();
            input.url = url;

            resolve(input);
        }));
}

export function parseArtist(platformName: keyof Platforms,
                            url: string): Promise<ArtistParser> {
    return platforms[platformName].createArtistParser()
        .create(() => new Promise<ArtistInput>(resolve => {
            let input: ArtistInput = new ArtistInput();
            input.url = url;

            resolve(input);
        }));
}

export function parsePlaylist(platformName: keyof Platforms,
                              url: string): Promise<PlaylistParser> {
    return platforms[platformName].createPlaylistParser()
        .create(() => new Promise<PlaylistInput>(resolve => {
            let input: PlaylistInput = new PlaylistInput();
            input.url = url;

            resolve(input);
        }));
}

export function parseSearch(platformName: keyof Platforms,
                            query: string): Promise<SearchParser> {
    return platforms[platformName].createSearchParser()
        .create(() => new Promise<SearchInput>(resolve => {
            let input: SearchInput = new SearchInput();
            input.query = query;

            resolve(input);
        }));
}
