import AlbumParser from "../parser/album_parser";
import ArtistParser from "../parser/artist_parser";
import PlaylistParser from "../parser/playlist_parser";
import SearchParser from "../parser/search_parser";
import SongParser from "../parser/song_parser";

export default class Platform {
    public createSongParser(): SongParser {
        return new SongParser(this);
    }

    public createAlbumParser(): AlbumParser {
        return new AlbumParser(this);
    }

    public createArtistParser(): ArtistParser {
        return new ArtistParser(this);
    }

    public createPlaylistParser(): PlaylistParser {
        return new PlaylistParser(this);
    }

    public createSearchParser(): SearchParser {
        return new SearchParser(this);
    }
}
