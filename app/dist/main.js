"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// import path from "path";
let mainWindow;
electron_1.app.on("ready", () => {
    mainWindow = new electron_1.BrowserWindow({
        title: "Musique",
        width: 800,
        height: 600
    });
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});
//# sourceMappingURL=main.js.map