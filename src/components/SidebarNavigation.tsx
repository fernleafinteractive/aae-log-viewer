import {useState, useRef, useEffect, useCallback} from "react";

import UploadIcon from "./icons/UploadIcon.jsx";
import {useLogData} from "../context/LogDataContext";
import {ViewType} from "../types/view_types";

function isSelectedView(view : ViewType, currentView : ViewType) {
    return view === currentView;
}

export default function SidebarNavigation({view, setView}) {

    const {setLogs} = useLogData();
    const inputWorkerRef = useRef<Worker>();

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

        worker.onmessage = (event) => {
            setLogs(event.data);
        }

        inputWorkerRef.current = worker;

        return () => {
            worker.terminate();
            inputWorkerRef.current = null;
        }

    }, []);

    return (
        <div className={"sidebar-navigation h-screen p-4"}>
            <div>
                <div className={"flex items-center justify-evenly p-2 font-bold text-white rounded-[0.25rem] bg-[#33B47E]"}>
                    <UploadIcon className={"size-6 font-bold"} />
                    <label htmlFor="file-input" className="cursor-pointer">Upload</label>
                    <input type="file" className="focus:outline-none hidden" onChange={fileSelect} multiple={true} />
                </div>

                <ul className={"whitespace-nowrap text-left border-t-[1px] border-green-600 mt-3 pt-3"}>
                    <li className={`px-4 py-0.5 mb-1 ${isSelectedView(view, "LOGS") ? 'bg-green-500' : ''}`} onClick={()=>setView("LOGS")}>Logs</li>
                    <li className={`px-4 py-0.5 mb-1 ${isSelectedView(view, "TASK_EXECUTION") ? 'bg-green-500' : ''}`} onClick={()=>setView("TASK_EXECUTION")}>Task Execution</li>
                    <li className={`px-4 py-0.5 mb-1 ${isSelectedView(view, "MEMORY_VIEW") ? 'bg-green-500' : ''}`} onClick={()=>setView("MEMORY_VIEW")}>Memory View</li>
                    <li className={`px-4 py-0.5 mb-1 ${isSelectedView(view, "TASK_GRAPH") ? 'bg-green-500' : ''}`} onClick={()=>setView("TASK_GRAPH")}>Task Graph</li>
                </ul>
            </div>
        </div>
    )
}
