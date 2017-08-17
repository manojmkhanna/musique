import BaseInput from "./base_input";
import ArtistInput from "./artist_input";
import SongInput from "./song_input";

export default class AlbumInput extends BaseInput {
    public artists: ArtistInput[];
    public composers: ArtistInput[];
    public producers: ArtistInput[];
    public songs: SongInput[];
}
