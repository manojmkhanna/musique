/// <reference types="bluebird" />
import * as Promise from "bluebird";
import SongParser from "./parser/song_parser";
import AlbumParser from "./parser/album_parser";
import ArtistParser from "./parser/artist_parser";
import PlaylistParser from "./parser/playlist_parser";
import SearchParser from "./parser/search_parser";
export declare type PlatformName = "deezer" | "saavn";
export declare function parseSong(platformName: PlatformName, url: string): Promise<SongParser>;
export declare function parseAlbum(platformName: PlatformName, url: string): Promise<AlbumParser>;
export declare function parseArtist(platformName: PlatformName, url: string): Promise<ArtistParser>;
export declare function parsePlaylist(platformName: PlatformName, url: string): Promise<PlaylistParser>;
export declare function parseSearch(platformName: PlatformName, query: string): Promise<SearchParser>;
