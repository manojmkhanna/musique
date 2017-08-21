"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const saavn_platform_1 = require("./other/saavn/saavn_platform");
const song_input_1 = require("./input/song_input");
const album_input_1 = require("./input/album_input");
const artist_input_1 = require("./input/artist_input");
const playlist_input_1 = require("./input/playlist_input");
const search_input_1 = require("./input/search_input");
function createPlatform(platformName) {
    if (platformName === "saavn") {
        return new saavn_platform_1.default();
    }
    else {
        throw new Error("platformName is invalid!");
    }
}
function parseSong(platformName, url) {
    return createPlatform(platformName).createSongParser()
        .create(() => new Promise(resolve => {
        let input = new song_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parseSong = parseSong;
function parseAlbum(platformName, url) {
    return createPlatform(platformName).createAlbumParser()
        .create(() => new Promise(resolve => {
        let input = new album_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parseAlbum = parseAlbum;
function parseArtist(platformName, url) {
    return createPlatform(platformName).createArtistParser()
        .create(() => new Promise(resolve => {
        let input = new artist_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parseArtist = parseArtist;
function parsePlaylist(platformName, url) {
    return createPlatform(platformName).createPlaylistParser()
        .create(() => new Promise(resolve => {
        let input = new playlist_input_1.default();
        input.url = url;
        resolve(input);
    }));
}
exports.parsePlaylist = parsePlaylist;
function parseSearch(platformName, query) {
    return createPlatform(platformName).createSearchParser()
        .create(() => new Promise(resolve => {
        let input = new search_input_1.default();
        input.query = query;
        resolve(input);
    }));
}
exports.parseSearch = parseSearch;

//# sourceMappingURL=index.js.map
