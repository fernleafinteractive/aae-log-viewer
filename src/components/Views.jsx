import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import {useState} from "react";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import ChevronUp from "./ChevronUp.jsx";
import ChevronDown from "./ChevronDown.jsx";
import {Button} from "flowbite-react";
import Loading from "./Loading.jsx";
import {getRandomColor} from "../log_utils.js";

export default function Views({logs, connected}) {

    return (
        <>
            <Logs
                logs={logs}
                connected={connected}
            />
            <TaskTimings logs={logs} />
        </>
    )

}

function Logs({logs, connected}) {

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
            <FilterBar logs={logs} setStatusFilter={setStatusFilter} setMessageFilter={setMessageFilter} connected={connected} />
            <LogView logs={filterLogs(logs, statusFilter, messageFilter)} />
        </>
    )
}

function TaskTimings({logs}) {

    const mapping = groupTasksById(logs);
    const totalExecutionTime = getTotalExecutionTime(mapping);

    return (
        <div>
            <div>Total exeuction time: {totalExecutionTime}</div>
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
    const [color, setColor] = useState(getRandomColor());

    return (
        <div className={"mb-4"}>
            <div className={"flex items-center"}>
                <div className={`p-2 rounded me-4`} style={{background: color}}></div>
                <div className={"me-4"}>{taskId}</div>
                <div className={"ms-auto me-4"}>{isTaskRunning(tasks) ?
                    <Loading/> : getTaskExecutionTime(tasks)}</div>
                <Button className={"ms-4"} onClick={() => {
                    setShowTimings(!showTimings)
                }}>
                    {showTimings ? <ChevronUp/> : <ChevronDown/>}
                </Button>

            </div>
            <div className={!showTimings ? 'hidden border-0' : 'border-s-2 ms-1.5 ps-2'} style={{borderColor: color}}>
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

    return Array.from(map, ([key, value]) => ({key, value}));
}

function getTaskExecutionTime(data) {
    const timestamps = data.map(d => d.data.timestamp);
    console.log(timestamps);
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);

    return `${max - min} ms`;
}

function getTotalExecutionTime(data) {
    let sum = 0;
    for(const d of data) {
        sum += getTaskExecutionTime(d.value);
    }
    return sum;
}

function isTaskRunning(data) {
    console.log(data);
    for(const task of data) {
        if (task.data.task_status === 'COMPLETE' || task.data.task_status === 'FAILED') {
            return false;
        }
    }

    return true;
}