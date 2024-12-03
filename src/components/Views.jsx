import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import {useState} from "react";
import TaskTimings from "./TaskTimings.jsx";

export default function Views({logs, connected, fileSelect}) {

    const [logView, setLogView] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");
    const [messageFilter, setMessageFilter] = useState("");

    function filterLogs(logs, filter, message) {
        let _logs = [];
        if(filter.length !== 0 && filter !== "All") {
            _logs = logs.filter(log => log.log_level === filter);
        } else {
            _logs = [...logs];
        }

        if(message.length > 0) {
            _logs = _logs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
        }

        return _logs;
    }

    return (
        <>
            <FilterBar logs={logs} setStatusFilter={setStatusFilter} setMessageFilter={setMessageFilter} connected={connected} fileSelect={fileSelect} logView={logView} setLogView={setLogView} />

            {
                logView ?
                    <LogView logs={filterLogs(logs, statusFilter, messageFilter)} />
                    :
                    <TaskTimings logs={filterLogs(logs, statusFilter, messageFilter)} />
            }
        </>
    )

}