import {socket} from "../socket";
import {useEffect} from "react";
import InputFilter from "./InputFilter.jsx";
import DropdownFilter from "./DropdownFilter.jsx";

export default function FilterBar({logs, setStatusFilter, connected, setMessageFilter}) {

    return (
        <div className={"flex items-center my-4 py-4 border-b-2"}>
            <DropdownFilter setStatusFilter={setStatusFilter} />
            <InputFilter setMessageFilter={setMessageFilter} />

            <div className={"ms-4 grid grid-cols-3 space-x-2"}>
                <div className={"col-span-1 bg-gray-400 rounded-md text-white p-1"}>{logs.length} Logs</div>
                <div className={"col-span-1 bg-green-400 rounded-md text-white p-1"}>{logs.filter(l => l.log_level === 'TASK_STATUS' && l.data.task_status === 'COMPLETE').length} Completed Tasks</div>
                <div className={"col-span-1 bg-red-400 rounded-md text-white p-1"}>{logs.filter(l => l.log_level === 'TASK_STATUS' && l.data.task_status === 'FAILED').length} Failed Tasks</div>
            </div>

            <div className={"flex items-center justify-between bg-gray-200 p-2 rounded-md ms-auto"}>
                Connection <div className={`p-1 animate-pulse rounded-[180px] ${connected ? 'bg-green-500' : 'bg-red-500'} ms-2`}></div>
            </div>
        </div>
    )

}