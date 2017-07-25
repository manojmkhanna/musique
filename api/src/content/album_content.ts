import BaseContent from "./base_content";
import ArtistContent from "./artist_content";
import SongContent from "./song_content";

export default class AlbumContent extends BaseContent {
    artists: ArtistContent[];
    composers: ArtistContent[];
    producers: ArtistContent[];
    songs: SongContent[];
}
