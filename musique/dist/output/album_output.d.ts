import BaseOutput from "./base_output";
import ArtistOutput from "./artist_output";
import SongOutput from "./song_output";
export default class AlbumOutput extends BaseOutput {
    art: string;
    date: string;
    label: string;
    language: string;
    title: string;
    year: number;
    artists: ArtistOutput[];
    songs: SongOutput[];
}
