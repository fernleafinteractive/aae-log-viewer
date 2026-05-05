import {useState, useRef, useEffect, useCallback} from "react";

import {useLogData} from "../context/LogDataContext";
import {ViewType} from "../types/view_types";
import UploadField from "./UploadField";
import {useLogDataMapping} from "../context/LogDataMappingContext";

function isSelectedView(view : ViewType, currentView : ViewType) {
    return view === currentView;
}

export default function SidebarNavigation({view, setView}) {

    const {logs, setLogs} = useLogData();
    const {mapping, totalExecutionTime, setMapping} = useLogDataMapping();

    const inputWorkerRef = useRef<Worker>();
    const mappingWorkerRef = useRef<Worker>();

    const fileSelect = useCallback(async (e) => {
        if(inputWorkerRef.current === null) {
            console.error("worker is not setup");
            return;
        }

        e.preventDefault();
        if(e.target.files.length === 0) return;

        inputWorkerRef.current.postMessage(e.target.files);
    }, [inputWorkerRef.current]);

    useEffect(() => {
        const worker = new Worker(new URL("../workers/input_worker.js", import.meta.url));
        const mappingWorker = new Worker(new URL("./../workers/timings_worker.js", import.meta.url));

        mappingWorker.onmessage = (event) => {
            const data = {
                mapping: event.data.mapping,
                totalExecutionTime: event.data.totalExecutionTime
            }

            setMapping({
                mapping: data.mapping,
                totalExecutionTime: data.totalExecutionTime
            });
        }

        worker.onmessage = (event) => {
            setLogs(event.data);
        }

        inputWorkerRef.current = worker;
        mappingWorkerRef.current = mappingWorker;

        return () => {
            worker.terminate();
            inputWorkerRef.current = null;

            mappingWorker.terminate();
            mappingWorkerRef.current = null;
        }

    }, []);

    useEffect(() => {
        if(logs.length === 0) return;

        mappingWorkerRef.current.postMessage(logs);
    }, [logs]);

    return (
        <div className={"sidebar-navigation h-screen p-4 bg-[#272B34] rounded-[0.25rem]"}>
            <div>

                <UploadField fileSelect={fileSelect} label={"Upload Logs"} />

                <ul className={"whitespace-nowrap text-left border-t-[2px] border-[#363A45] mt-3 pt-3"}>
                    <li className={`px-4 py-0.5 mb-1 hover:bg-[#44a685] hover:cursor-pointer hover:text-white rounded-[0.25rem] ${isSelectedView(view, "LOGS") ? 'bg-[#4DBE98] text-white' : ''}`}
                        onClick={() => setView("LOGS")}>Logs
                    </li>
                    <li className={`px-4 py-0.5 mb-1 hover:bg-[#44a685] hover:cursor-pointer hover:text-white rounded-[0.25rem] ${isSelectedView(view, "TASK_EXECUTION") ? 'bg-[#4DBE98] text-white' : ''}`}
                        onClick={() => setView("TASK_EXECUTION")}>Task Execution
                    </li>
                    <li className={`px-4 py-0.5 mb-1 hover:bg-[#44a685] hover:cursor-pointer hover:text-white rounded-[0.25rem] ${isSelectedView(view, "MEMORY_VIEW") ? 'bg-[#4DBE98] text-white' : ''}`}
                        onClick={() => setView("MEMORY_VIEW")}>Memory View
                    </li>
                    <li className={`px-4 py-0.5 mb-1 hover:bg-[#44a685] hover:cursor-pointer hover:text-white rounded-[0.25rem] ${isSelectedView(view, "TASK_GRAPH") ? 'bg-[#4DBE98] text-white' : ''}`}
                        onClick={() => setView("TASK_GRAPH")}>Task Graph
                    </li>
                </ul>
            </div>
        </div>
    )
}
