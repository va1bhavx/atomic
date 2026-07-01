import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveToken: (token: string) => ipcRenderer.invoke("token:set", token),
  getToken: () => ipcRenderer.invoke("token:get"),
  deleteToken: () => ipcRenderer.invoke("token:delete"),
});
