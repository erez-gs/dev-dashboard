import React, { useState } from "react";

function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.maximize();
  };

  return (
    <>
      <div className="py-0.5 flex justify-between draggable">
        <div className="inline-flex -mt-1">
          <button
            onClick={window.Main.openDevTools}
            className="pt-1 bg-gray-100 undraggable md:px-4 lg:px-3 hover:bg-gray-300"
          >
            Dev
          </button>
          <button
            onClick={window.Main.minimize}
            className="pt-1 undraggable md:px-4 lg:px-3 hover:bg-gray-300"
          >
            &#8211;
          </button>
          <button
            onClick={handleToggle}
            className="px-6 pt-1 undraggable lg:px-5 hover:bg-gray-300"
          >
            {isMaximize ? "\u2752" : "⃞"}
          </button>
          <button
            onClick={window.Main.close}
            className="px-4 pt-1 undraggable hover:bg-red-500 hover:text-white"
          >
            &#10005;
          </button>
        </div>
      </div>
      {/* <div className="text-white bg-gray-900 undraggable">
        <div className="flex text-center">
          <div className="w-8 text-sm hover:bg-gray-700">File</div>
          <div className="w-8 text-sm hover:bg-gray-700">Edit</div>
          <div className="w-10 text-sm hover:bg-gray-700">View</div>
          <div className="text-sm w-14 hover:bg-gray-700 ">Window</div>
          <div className="text-sm w-9 hover:bg-gray-700 ">Help</div>
        </div>
      </div> */}
    </>
  );
}

export default AppBar;
