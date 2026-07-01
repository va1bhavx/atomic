import { app, BrowserWindow, ipcMain, safeStorage } from "electron";
import path from "path";
import fs from "fs";

// A local config file path to save the encrypted token in the user's local app data directory
const tokenPath = path.join(app.getPath("userData"), "token.bin");

ipcMain.handle("token:set", (_, token: string) => {
  try {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(token);
      fs.writeFileSync(tokenPath, encrypted);
      return true;
    }
    // Fallback if encryption is not available on OS level
    fs.writeFileSync(tokenPath, Buffer.from(token, "utf-8"));
    return false;
  } catch (error) {
    console.error("Failed to save token:", error);
    return false;
  }
});

ipcMain.handle("token:get", () => {
  try {
    if (fs.existsSync(tokenPath)) {
      const encrypted = fs.readFileSync(tokenPath);
      if (safeStorage.isEncryptionAvailable()) {
        return safeStorage.decryptString(encrypted);
      }
      return encrypted.toString("utf-8");
    }
  } catch (error) {
    console.error("Failed to retrieve token:", error);
  }
  return null;
});

ipcMain.handle("token:delete", () => {
  try {
    if (fs.existsSync(tokenPath)) {
      fs.unlinkSync(tokenPath);
      return true;
    }
  } catch (error) {
    console.error("Failed to delete token:", error);
  }
  return false;
});

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});
