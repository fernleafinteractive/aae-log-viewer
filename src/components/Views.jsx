import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import {useState} from "react";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import ChevronUp from "./ChevronUp.jsx";
import ChevronDown from "./ChevronDown.jsx";
import {Button} from "flowbite-react";
import Loading from "./Loading.jsx";
import {getRandomColor, stringToColor} from "../log_utils.js";
import ErrorIcon from "./ErrorIcon.jsx";

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

function TaskTimings({logs}) {

    const mapping = groupTasksById(logs);
    const totalExecutionTime = getTotalExecutionTime(mapping);

    return (
        <div>
            <h1 className={"text-xl mb-4 bg-gray-300 p-2 rounded"}>Total execution time: <span className={"font-bold"}>{totalExecutionTime > 1000 ? totalExecutionTime / 1000 : totalExecutionTime}</span> {totalExecutionTime > 1000 ? 'seconds' : 'ms'}</h1>

            <div className={"flex items-center rounded"}>

                {mapping.map((task, index) => (
                    <div title={task.key} key={index} className={`first:rounded-s last:rounded-e mb-4 p-3`} style={{width: `${(getTaskExecutionTime(task.value)/totalExecutionTime)*100}%`, backgroundColor: `${stringToColor(task.key)}`}}></div>
                ))}

            </div>

            {mapping.map((task, index) => (
                <div key={index}>
                    <Timing taskId={task.key} tasks={task.value} />
                </div>
            ))}
        </div>
    )

}

function Timing({taskId, tasks}) {
    const [showTimings, setShowTimings] = useState(false);

    return (
        <div className={"mb-4"}>
            <div className={"flex items-center"}>
                <div className={`p-2 rounded me-4`} style={{backgroundColor: stringToColor(taskId)}}></div>
                <div className={"me-4 flex items-center"}>
                    {taskId}
                    {didTaskFail(tasks) ? <span title={"task failed"} className={"text-red-500 ms-4"}><ErrorIcon /></span>
                    : ''}
                </div>
                <div className={"ms-auto me-4"}>{isTaskRunning(tasks) ?
                    <Loading/> : `${getTaskExecutionTime(tasks)}ms`}</div>
                <button className={"ms-4"} onClick={() => {
                    setShowTimings(!showTimings)
                }}>
                    {showTimings ? <ChevronUp/> : <ChevronDown/>}
                </button>

            </div>
            <div className={!showTimings ? 'hidden border-0' : 'border-s-2 ms-1.5 ps-2'} style={{borderColor:  stringToColor(taskId)}}>
                {tasks.map((v, index) => (
                    <LogTaskStatusRow info={v} key={index}/>
                ))}
            </div>
        </div>
    )

}

function groupTasksById(logs) {
    const filtered = logs.filter(log => log.log_level === 'TASK_STATUS');
    const map = new Map();

    for (const log of filtered) {
        const taskId = log.data.data.task_id;
        if (!map.has(taskId)) {
            map.set(taskId, []);
        }

        map.get(taskId).push(log);
    }

    let s = new Map([...map.entries()].sort((a, b) => {
        return getTaskExecutionTime(b[1]) - getTaskExecutionTime(a[1]);
    }))

    return Array.from(s, ([key, value]) => ({key, value}));
}

function getTaskExecutionTime(data) {
    const timestamps = data.map(d => d.data.timestamp);
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);

    return max - min;
}

function getTotalExecutionTime(data) {
    let sum = 0;
    for(const d of data) {
        sum += getTaskExecutionTime(d.value);
    }
    return sum;
}

function isTaskRunning(data) {
    for(const task of data) {
        if (task.data.task_status === 'COMPLETE' || task.data.task_status === 'FAILED') {
            return false;
        }
    }

    return true;
}

function didTaskFail(data) {
    for(const task of data) {
        if (task.data.task_status === 'FAILED') {
            return true;
        }
    }

    return false;
}