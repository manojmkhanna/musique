import BaseOutput from "./base_output";
import ArtistOutput from "./artist_output";
import SongOutput from "./song_output";

export default class AlbumOutput extends BaseOutput {
    public art: string;
    public label: string;
    public language: string;
    public title: string;
    public year: string;
    public artists: ArtistOutput[];
    public songs: SongOutput[];
}
