import { ipcRenderer, contextBridge } from "electron";

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sayHello`
   */
  sendMessage: (message: string) => {
    ipcRenderer.send("message", message);
  },
  openDevTools: () => {
    ipcRenderer.send("open-dev-tools");
  },
  minimize: () => {
    ipcRenderer.send("minimize");
  },
  maximize: () => {
    ipcRenderer.send("maximize");
  },
  close: () => {
    ipcRenderer.send("close");
  },

  makeDashboardPortForward: (): Promise<string> => {
    return ipcRenderer.invoke("make-dashboard-port-forward");
  },
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
};
contextBridge.exposeInMainWorld("Main", api);
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
