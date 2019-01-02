import AlbumContent from "./album_content";
import ArtistContent from "./artist_content";
import BaseContent from "./base_content";

export default class SongContent extends BaseContent {
    public album: AlbumContent;
    public artists: ArtistContent[];
}
