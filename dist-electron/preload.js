import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
    saveToken: (token) => ipcRenderer.invoke("token:set", token),
    getToken: () => ipcRenderer.invoke("token:get"),
    deleteToken: () => ipcRenderer.invoke("token:delete"),
});
