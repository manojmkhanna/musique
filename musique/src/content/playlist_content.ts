import BaseContent from "./base_content";
import SongContent from "./song_content";

export default class PlaylistContent extends BaseContent {
    public songs: SongContent[];
}
