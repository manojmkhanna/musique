import Platform from "../../platform/platform";
import SongParser from "../../parser/song_parser";
import AlbumParser from "../../parser/album_parser";
export default class DeezerPlatform extends Platform {
    createSongParser(): SongParser;
    createAlbumParser(): AlbumParser;
}
