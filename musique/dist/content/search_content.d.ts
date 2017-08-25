import { Content } from "parsque";
import SongContent from "./song_content";
import AlbumContent from "./album_content";
import ArtistContent from "./artist_content";
import PlaylistContent from "./playlist_content";
export default class SearchContent extends Content {
    html: string;
    songs: SongContent[];
    albums: AlbumContent[];
    artists: ArtistContent[];
    playlists: PlaylistContent[];
}
