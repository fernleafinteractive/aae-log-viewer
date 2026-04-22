import {useCallback, useEffect, useState} from "react";
import Views from "./components/Views";
import TaskGraph from "./components/TaskGraph.jsx";
import SidebarNavigation from "./components/SidebarNavigation";
import {ViewType} from "./types/view_types";
import {useLogDataMapping} from "./context/LogDataMappingContext";
import TaskTimings from "./components/TaskTimings.jsx";
import MemoryChart from "./components/MemoryChart";

function getViewByType(type : ViewType) {

    const {mapping, totalExecutionTime, setMapping} = useLogDataMapping();

    switch (type) {
        case "LOGS": return <Views />;
        case "TASK_EXECUTION": return <TaskTimings mapping={mapping} totalExecutionTime={totalExecutionTime} />;
        case "MEMORY_VIEW": return <MemoryChart />;
        case "TASK_GRAPH": return <TaskGraph />;
    }
}

function App() {
    // LOG_VIEW, TASK_GRAPH
    const [view, setView] = useState<ViewType>('LOGS');

  return (
      <div className={"px-24 h-[100%]"}>

          <div className={"flex"}>
              <SidebarNavigation setView={setView} />
              <div className={"h-screen border-2 border-green-500 grow grid grid-rows-[auto_1fr]"}>
                  {getViewByType(view)}
              </div>
          </div>
      </div>
  )
}

export default App
