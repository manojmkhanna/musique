import BaseOutput from "./base_output";
import AlbumOutput from "./album_output";
import ArtistOutput from "./artist_output";
export default class SongOutput extends BaseOutput {
    comments: string;
    duration: string;
    genre: string;
    lyrics: string;
    mp3: string;
    played: number;
    quality: string;
    rating: number;
    subtitle: string;
    title: string;
    track: number;
    album: AlbumOutput;
    artists: ArtistOutput[];
    writers: ArtistOutput[];
}
