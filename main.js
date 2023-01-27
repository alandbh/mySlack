const {
    app,
    BrowserWindow,
    Tray,
    systemPreferences,
    desktopCapturer,
} = require("electron");
const { resolve } = require("path");
const contextMenu = require("electron-context-menu");

contextMenu();

systemPreferences
    .askForMediaAccess("camera")
    .then((allowed) => console.log("Camera is allowed"));

systemPreferences
    .askForMediaAccess("microphone")
    .then((allowed) => console.log("microphone is allowed"));

const screenPrivilege = systemPreferences.getMediaAccessStatus("screen");

console.log(`screenPrivilege: ${screenPrivilege}`);

const iconPngPath = resolve(__dirname, "myslack-logo-64.png");
const iconIcnsPath = resolve(__dirname, "my_slack_logo.icns");
const iconTrayPath = resolve(__dirname, "myslack-logo-16.png");

let win;
let appTray;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1024,
        height: 720,
        frame: true,
        // titleBarStyle: "default",
        title: "My Slack",
        icon: iconPngPath,
    });

    console.log("ICONNNN", iconPngPath);

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

    app.dock.setIcon(iconPngPath);

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    appTray = new Tray(iconTrayPath);

    appTray.setToolTip("My Slack");

    appTray.on("click", () => {
        if (win.isVisible()) {
            win.hide();
            return;
        }

        win.show();
        return;
    });

    desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then(async (sources) => {
            win.webContents.send("SEND_SCREEN_SHARE_SOURCES", sources);
        });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
