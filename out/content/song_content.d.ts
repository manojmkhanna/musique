import BaseContent from "./base_content";
import AlbumContent from "./album_content";
import ArtistContent from "./artist_content";
export default class SongContent extends BaseContent {
    album: AlbumContent;
    artists: ArtistContent[];
    writers: ArtistContent[];
}
