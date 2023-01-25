const { app, BrowserWindow, Menu, MenuItem } = require("electron");
const contextMenu = require("electron-context-menu");

contextMenu();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 720,
        frame: true,
        titleBarStyle: "default",
    });

    // win.loadFile("index.html");

    win.webContents.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );
    win.loadURL("https://app.slack.com/client/").then(() => {
        const currentURL = win.webContents.getUserAgent();
        console.log(currentURL);
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
