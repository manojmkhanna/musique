import ArtistInput from "./artist_input";
import BaseInput from "./base_input";
import SongInput from "./song_input";

export default class AlbumInput extends BaseInput {
    public artists: ArtistInput[];
    public songs: SongInput[];
}
