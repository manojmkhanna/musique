import SongParser from "../parser/song_parser";
import AlbumParser from "../parser/album_parser";
import ArtistParser from "../parser/artist_parser";
import PlaylistParser from "../parser/playlist_parser";
import SearchParser from "../parser/search_parser";
export default abstract class Platform {
    readonly name: string;
    constructor(name: string);
    abstract createSongParser(): SongParser;
    abstract createAlbumParser(): AlbumParser;
    abstract createArtistParser(): ArtistParser;
    abstract createPlaylistParser(): PlaylistParser;
    abstract createSearchParser(): SearchParser;
}
