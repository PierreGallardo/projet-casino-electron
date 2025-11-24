// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // On crée une fonction 'login' que le frontend pourra appeler
    login: (data) => ipcRenderer.invoke('login-check', data)
});