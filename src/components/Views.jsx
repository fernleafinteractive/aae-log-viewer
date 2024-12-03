import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import {useState} from "react";
import TaskTimings from "./TaskTimings.jsx";

export default function Views({logs, connected, fileSelect}) {

    const [logView, setLogView] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");
    const [taskFilter, setTaskFilter] = useState("");
    const [messageFilter, setMessageFilter] = useState("");

    function filterLogs(logs, filter, tFilter, message) {
        let _logs = [];
        if(filter.length !== 0 && filter !== "ALL") {
            _logs = logs.filter(log => log.log_level === filter);
        } else {
            _logs = [...logs];
        }

        console.log(_logs);
        if(filter === "TASK_STATUS") {
            if(tFilter.length !== 0 && tFilter !== "ALL") {
                _logs = _logs.filter(log => log.data.task_status === tFilter);
            }
        }

        if(message.length > 0) {
            _logs = _logs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
        }

        return _logs;
    }

    return (
        <>
            <FilterBar logs={logs} statusFilter={statusFilter} setStatusFilter={setStatusFilter} setTaskFilter={setTaskFilter} setMessageFilter={setMessageFilter} connected={connected} fileSelect={fileSelect} logView={logView} setLogView={setLogView} />

            {
                logView ?
                    <LogView logs={filterLogs(logs, statusFilter, taskFilter, messageFilter)} />
                    :
                    <TaskTimings logs={filterLogs(logs, statusFilter, messageFilter)} />
            }
        </>
    )

}