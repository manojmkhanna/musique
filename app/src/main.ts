import {app, BrowserWindow} from "electron";
// import path from "path";

let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        title: "Musique",
        width: 800,
        height: 600
    });
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});
