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
import DeezerProvider from "./other/deezer/deezer_provider";
import SaavnProvider from "./other/saavn/saavn_provider";
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
import Provider from "./provider/provider";

export {
    SongInput, SongOutput, SongContent, SongParser,
    AlbumInput, AlbumOutput, AlbumContent, AlbumParser,
    ArtistInput, ArtistOutput, ArtistContent, ArtistParser,
    PlaylistInput, PlaylistOutput, PlaylistContent, PlaylistParser,
    SearchInput, SearchOutput, SearchContent, SearchParser
};

function createProvider(name: "deezer" | "saavn"): Provider {
    if (name == "deezer") {
        return new DeezerProvider();
    } else if (name == "saavn") {
        return new SaavnProvider();
    }
}

export function parseSong(name: "deezer" | "saavn", url: string): Promise<SongParser> {
    return createProvider(name).createSongParser().create(() => new Promise<SongInput>(resolve => {
        let input: SongInput = new SongInput();
        input.url = url;

        resolve(input);
    }));
}

export function parseAlbum(name: "deezer" | "saavn", url: string): Promise<AlbumParser> {
    return createProvider(name).createAlbumParser().create(() => new Promise<AlbumInput>(resolve => {
        let input: AlbumInput = new AlbumInput();
        input.url = url;

        resolve(input);
    }));
}

export function parseArtist(name: "deezer" | "saavn", url: string): Promise<ArtistParser> {
    return createProvider(name).createArtistParser().create(() => new Promise<ArtistInput>(resolve => {
        let input: ArtistInput = new ArtistInput();
        input.url = url;

        resolve(input);
    }));
}

export function parsePlaylist(name: "deezer" | "saavn", url: string): Promise<PlaylistParser> {
    return createProvider(name).createPlaylistParser().create(() => new Promise<PlaylistInput>(resolve => {
        let input: PlaylistInput = new PlaylistInput();
        input.url = url;

        resolve(input);
    }));
}

export function parseSearch(name: "deezer" | "saavn", query: string): Promise<SearchParser> {
    return createProvider(name).createSearchParser().create(() => new Promise<SearchInput>(resolve => {
        let input: SearchInput = new SearchInput();
        input.query = query;

        resolve(input);
    }));
}
