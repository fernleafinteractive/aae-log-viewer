import {useCallback, useEffect, useState} from "react";
import Views from "./components/Views";
import TaskGraph from "./components/TaskGraph.jsx";
import SidebarNavigation from "./components/SidebarNavigation";

function App() {
    // LOG_VIEW, TASK_GRAPH
    const [view, setView] = useState('LOG_VIEW');

  return (
      <div className={"px-24 h-[100%]"}>

          <div className={"flex"}>
              <SidebarNavigation />
              <Views />
          </div>

        {/*<div className={"basis-auto"}>
          <div className={"my-4 p-2 rounded-md bg-gray-200"}>
              <ul className={"flex items-center"} style={{fontSize: "1rem"}}>
                  <li className={`me-4 hover:cursor-pointer ${view === 'LOG_VIEW' ? "text-blue-500 underline" : "text-black"}`} onClick={() => setView('LOG_VIEW')}>Log View</li>
                  <li className={`me-4 hover:cursor-pointer ${view === 'TASK_GRAPH' ? "text-blue-500 underline" : "text-black"}`} onClick={() => setView('TASK_GRAPH')}>Task Graph</li>
              </ul>
          </div>

          {
              view === 'LOG_VIEW' ?
                  <Views />
                  :
                  <TaskGraph/>
          }
        </div>*/}
      </div>
  )
}

export default App
