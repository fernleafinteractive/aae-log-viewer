import {useCallback, useEffect, useState} from "react";
import Views from "./components/Views";
import TaskGraph from "./components/TaskGraph.jsx";
import SidebarNavigation from "./components/SidebarNavigation";
import {ViewType} from "./types/view_types";
import {useLogDataMapping} from "./context/LogDataMappingContext";
import TaskTimings from "./components/TaskTimings.jsx";
import MemoryChart from "./components/MemoryChart";

function getViewByType(type: ViewType) {

    const {mapping, totalExecutionTime, setMapping} = useLogDataMapping();

    switch (type) {
        case "LOGS":
            return <Views/>;
        case "TASK_EXECUTION":
            return <TaskTimings mapping={mapping} totalExecutionTime={totalExecutionTime}/>;
        case "MEMORY_VIEW":
            return <MemoryChart/>;
        case "TASK_GRAPH":
            return <TaskGraph/>;
    }
}

export default function App() {
    const [view, setView] = useState<ViewType>('LOGS');

    const [mappingWorker, setMappingWorker] = useState(null);

    return (
        <div className={"px-24 h-[100%]"}>

            <div className={"flex gap-x-4"}>
                <SidebarNavigation view={view} setView={setView}/>
                <div className={"h-screen grow flex flex-col"}>
                    {getViewByType(view)}
                </div>
            </div>
        </div>
    )
}
