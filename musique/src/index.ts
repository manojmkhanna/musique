import * as Promise from "bluebird";

import SongInput from "./input/song_input";
import SongOutput from "./output/song_output";
import SongContent from "./content/song_content";
import SongParser from "./parser/song_parser";
import AlbumInput from "./input/album_input";
import AlbumOutput from "./output/album_output";
import AlbumContent from "./content/album_content";
import AlbumParser from "./parser/album_parser";
import ArtistInput from "./input/artist_input";
import ArtistOutput from "./output/artist_output";
import ArtistContent from "./content/artist_content";
import ArtistParser from "./parser/artist_parser";
import PlaylistInput from "./input/playlist_input";
import PlaylistOutput from "./output/playlist_output";
import PlaylistContent from "./content/playlist_content";
import PlaylistParser from "./parser/playlist_parser";
import SearchInput from "./input/search_input";
import SearchOutput from "./output/search_output";
import SearchContent from "./content/search_content";
import SearchParser from "./parser/search_parser";
import Platform from "./platform/platform";
import DeezerPlatform from "./other/deezer/deezer_platform";
import SaavnPlatform from "./other/saavn/saavn_platform";

export {
    SongInput, SongOutput, SongContent, SongParser,
    AlbumInput, AlbumOutput, AlbumContent, AlbumParser,
    ArtistInput, ArtistOutput, ArtistContent, ArtistParser,
    PlaylistInput, PlaylistOutput, PlaylistContent, PlaylistParser,
    SearchInput, SearchOutput, SearchContent, SearchParser
};

export type PlatformName = "deezer" | "saavn";

let deezerPlatform: DeezerPlatform;
let saavnPlatform: SaavnPlatform;

function createPlatform(platformName: PlatformName): Platform {
    if (platformName === "deezer") {
        if (!deezerPlatform) {
            deezerPlatform = new DeezerPlatform();
        }

        return deezerPlatform;
    } else if (platformName === "saavn") {
        if (!saavnPlatform) {
            saavnPlatform = new SaavnPlatform();
        }

        return saavnPlatform;
    } else {
        throw new Error();
    }
}

export function parseSong(platformName: PlatformName, url: string): Promise<SongParser> {
    return createPlatform(platformName).createSongParser()
        .create(() => new Promise<SongInput>(resolve => {
            let input = new SongInput();
            input.url = url;

            resolve(input);
        }));
}

export function parseAlbum(platformName: PlatformName, url: string): Promise<AlbumParser> {
    return createPlatform(platformName).createAlbumParser()
        .create(() => new Promise<AlbumInput>(resolve => {
            let input = new AlbumInput();
            input.url = url;

            resolve(input);
        }));
}

export function parseArtist(platformName: PlatformName, url: string): Promise<ArtistParser> {
    return createPlatform(platformName).createArtistParser()
        .create(() => new Promise<ArtistInput>(resolve => {
            let input = new ArtistInput();
            input.url = url;

            resolve(input);
        }));
}

export function parsePlaylist(platformName: PlatformName, url: string): Promise<PlaylistParser> {
    return createPlatform(platformName).createPlaylistParser()
        .create(() => new Promise<PlaylistInput>(resolve => {
            let input = new PlaylistInput();
            input.url = url;

            resolve(input);
        }));
}

export function parseSearch(platformName: PlatformName, query: string): Promise<SearchParser> {
    return createPlatform(platformName).createSearchParser()
        .create(() => new Promise<SearchInput>(resolve => {
            let input = new SearchInput();
            input.query = query;

            resolve(input);
        }));
}
