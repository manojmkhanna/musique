import BaseOutput from "./base_output";
import AlbumOutput from "./album_output";
import ArtistOutput from "./artist_output";

export default class SongOutput extends BaseOutput {
    public duration: string;
    public genre: string;
    public lyrics: string;
    public mp3: string;
    public title: string;
    public track: number;
    public album: AlbumOutput;
    public artists: ArtistOutput[];
}
