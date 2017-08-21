import BaseInput from "./base_input";
import ArtistInput from "./artist_input";
import SongInput from "./song_input";
export default class AlbumInput extends BaseInput {
    artists: ArtistInput[];
    songs: SongInput[];
}