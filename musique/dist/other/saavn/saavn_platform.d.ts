import Platform from "../../platform/platform";
import SongParser from "../../parser/song_parser";
import AlbumParser from "../../parser/album_parser";
import ArtistParser from "../../parser/artist_parser";
import PlaylistParser from "../../parser/playlist_parser";
import SearchParser from "../../parser/search_parser";
export default class SaavnPlatform extends Platform {
    constructor();
    createSongParser(): SongParser;
    createAlbumParser(): AlbumParser;
    createArtistParser(): ArtistParser;
    createPlaylistParser(): PlaylistParser;
    createSearchParser(): SearchParser;
}
