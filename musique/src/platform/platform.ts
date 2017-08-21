import SongParser from "../parser/song_parser";
import AlbumParser from "../parser/album_parser";
import ArtistParser from "../parser/artist_parser";
import PlaylistParser from "../parser/playlist_parser";
import SearchParser from "../parser/search_parser";

export default abstract class Platform {
    public abstract createSongParser(): SongParser;

    public abstract createAlbumParser(): AlbumParser;

    public abstract createArtistParser(): ArtistParser;

    public abstract createPlaylistParser(): PlaylistParser;

    public abstract createSearchParser(): SearchParser;
}
