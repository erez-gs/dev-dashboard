//https://github.com/maxstue/vite-reactts-electron-starter

import React, { useEffect, useRef, useState } from "react";
import AppBar from "./AppBar";

function App() {
  const [terminalText, setTerminalText] = useState<string>("");
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.Main.on("message", (message: string) => {
      setTerminalText((prev) => prev + "\n" + message);
    });
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalText]);

  function clearTerminal() {
    setTerminalText("");
  }

  async function makeDashboardPortForward() {
    const dashboardPortForwardOutput: string =
      await window.Main.makeDashboardPortForward();

    setTerminalText(dashboardPortForwardOutput);
  }

  return (
    <div className="flex flex-col h-screen overflow-y-hidden">
      {window.Main && <AppBar />}
      <div className="flex flex-col h-full border-t-[1px] justify-between bg-gray-400">
        <div>
          <button
            onClick={makeDashboardPortForward}
            className="w-auto h-auto px-4 py-2 mt-4 bg-yellow-200 rounded hover:bg-gray-300"
          >
            Ports forward
          </button>
        </div>
        <div className="h-1/2">
          <button
            className="justify-end w-8 p-1 px-2 text-white bg-gray-800 rounded-t-lg hover:bg-gray-700"
            onClick={clearTerminal}
          >
            X
          </button>
          <div
            className="w-full h-full overflow-y-scroll bg-gray-800"
            ref={terminalRef}
          >
            <pre className="p-3 text-sm text-gray-200">{terminalText}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
