import BaseOutput from "./base_output";
import ArtistOutput from "./artist_output";
import SongOutput from "./song_output";
export default class AlbumOutput extends BaseOutput {
    art: string;
    label: string;
    language: string;
    title: string;
    year: string;
    artists: ArtistOutput[];
    songs: SongOutput[];
}
