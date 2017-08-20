"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const saavn_platform_1 = require("./other/saavn/saavn_platform");
const song_input_1 = require("./input/song_input");
new saavn_platform_1.default().createSongParser()
    .create(() => new Bluebird(resolve => {
    let input = new song_input_1.default();
    input.url = "https://www.saavn.com/s/song/english/Grateful/Im-the-One/CRkSXw1XT0k";
    resolve(input);
}))
    .then(parser => parser.parseTitle())
    .then(parser => {
    console.log(JSON.stringify(parser.output, null, 2));
})
    .catch(error => {
    console.error(error);
});

//# sourceMappingURL=index.js.map
