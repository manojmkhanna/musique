import BaseInput from "./base_input";
import AlbumInput from "./album_input";
import ArtistInput from "./artist_input";

export default class SongInput extends BaseInput {
    public album: AlbumInput;
    public artists: ArtistInput[];
    public writers: ArtistInput[];
}
