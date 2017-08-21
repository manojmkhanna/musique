import * as musique from "./index";

musique.parseSong("saavn", "https://www.saavn.com/s/song/english/Grateful/Im-the-One/CRkSXw1XT0k")
    .then(value => value.parse())
    .then(value => {
        console.log(JSON.stringify(value.output, null, 2));
    })
    .catch(error => {
        console.error(error);
    });
