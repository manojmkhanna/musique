import {Content} from "parsque";

import SongContent from "./song_content";
import AlbumContent from "./album_content";
import ArtistContent from "./artist_content";
import PlaylistContent from "./playlist_content";

export default class SearchContent extends Content {
    public html: string;
    public songs: SongContent[];
    public albums: AlbumContent[];
    public artists: ArtistContent[];
    public playlists: PlaylistContent[];
}
