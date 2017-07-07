import BaseContent from "./base_content";
import AlbumContent from "./album_content";
import SongContent from "./song_content";

export default class ArtistContent extends BaseContent {
    albums: AlbumContent[];
    songs: SongContent[];
}
