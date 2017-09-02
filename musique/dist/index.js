"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const song_input_1 = require("./input/song_input");
exports.SongInput = song_input_1.default;
const song_output_1 = require("./output/song_output");
exports.SongOutput = song_output_1.default;
const song_content_1 = require("./content/song_content");
exports.SongContent = song_content_1.default;
const song_parser_1 = require("./parser/song_parser");
exports.SongParser = song_parser_1.default;
const album_input_1 = require("./input/album_input");
exports.AlbumInput = album_input_1.default;
const album_output_1 = require("./output/album_output");
exports.AlbumOutput = album_output_1.default;
const album_content_1 = require("./content/album_content");
exports.AlbumContent = album_content_1.default;
const album_parser_1 = require("./parser/album_parser");
exports.AlbumParser = album_parser_1.default;
const artist_input_1 = require("./input/artist_input");
exports.ArtistInput = artist_input_1.default;
const artist_output_1 = require("./output/artist_output");
exports.ArtistOutput = artist_output_1.default;
const artist_content_1 = require("./content/artist_content");
exports.ArtistContent = artist_content_1.default;
const artist_parser_1 = require("./parser/artist_parser");
exports.ArtistParser = artist_parser_1.default;
const playlist_input_1 = require("./input/playlist_input");
exports.PlaylistInput = playlist_input_1.default;
const playlist_output_1 = require("./output/playlist_output");
exports.PlaylistOutput = playlist_output_1.default;
const playlist_content_1 = require("./content/playlist_content");
exports.PlaylistContent = playlist_content_1.default;
const playlist_parser_1 = require("./parser/playlist_parser");
exports.PlaylistParser = playlist_parser_1.default;
const search_input_1 = require("./input/search_input");
exports.SearchInput = search_input_1.default;
const search_output_1 = require("./output/search_output");
exports.SearchOutput = search_output_1.default;
const search_content_1 = require("./content/search_content");
exports.SearchContent = search_content_1.default;
const search_parser_1 = require("./parser/search_parser");
exports.SearchParser = search_parser_1.default;
const platforms_1 = require("./platform/platforms");
let platforms = new platforms_1.default();
function parseSong(platformName, url) {
    return platforms[platformName].createSongParser()
        .create(() => new Promise(resolve => {
        let input = new song_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parseSong = parseSong;
function parseAlbum(platformName, url) {
    return platforms[platformName].createAlbumParser()
        .create(() => new Promise(resolve => {
        let input = new album_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parseAlbum = parseAlbum;
function parseArtist(platformName, url) {
    return platforms[platformName].createArtistParser()
        .create(() => new Promise(resolve => {
        let input = new artist_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parseArtist = parseArtist;
function parsePlaylist(platformName, url) {
    return platforms[platformName].createPlaylistParser()
        .create(() => new Promise(resolve => {
        let input = new playlist_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parsePlaylist = parsePlaylist;
function parseSearch(platformName, query) {
    return platforms[platformName].createSearchParser()
        .create(() => new Promise(resolve => {
        let input = new search_input_1.default();
        input.query = query;
        resolve(input);
    }));
}
exports.parseSearch = parseSearch;

//# sourceMappingURL=index.js.map
