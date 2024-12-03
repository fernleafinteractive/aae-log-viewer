import {useEffect, useState} from "react";
import {stringToColor} from "../log_utils.js";
import ErrorIcon from "./ErrorIcon.jsx";
import Loading from "./Loading.jsx";
import ChevronUp from "./ChevronUp.jsx";
import ChevronDown from "./ChevronDown.jsx";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";

export default function TaskTimings({logs}) {

    const [mapping, setMapping] = useState([]);
    const [totalExecutionTime, setTotalExecutionTime] = useState(0);
    const [loading, setLoading] = useState(false);

    const [worker, setWorker] = useState(null);

    useEffect(() => {

        const myWorker = new Worker(new URL("./../workers/timings_worker.js", import.meta.url));

        myWorker.onmessage = (event) => {
            setMapping(event.data.mapping);
            setTotalExecutionTime(event.data.totalExecutionTime);
            setLoading(false);
        }

        setWorker(myWorker);

        return () => {
            myWorker.terminate();
        }
    }, []);

    useEffect(() => {

        if(worker === null) return;
        if(logs.length === 0) {
            setMapping([]);
            setTotalExecutionTime(0);
            return;
        }
        setLoading(true);
        worker.postMessage(logs);

    }, [logs, worker])

    if(loading) {
        return (
        <div className={"flex flex-1 items-center justify-center"}>
            <Loading />
        </div>
        )
    }

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

function getTaskExecutionTime(data) {
    const timestamps = data.map(d => d.data.timestamp);
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);

    return max - min;
}

function didTaskFail(data) {
    for(const task of data) {
        if (task.data.task_status === 'FAILED') {
            return true;
        }
    }

    return false;
}

function isTaskRunning(data) {
    for(const task of data) {
        if (task.data.task_status === 'COMPLETE' || task.data.task_status === 'FAILED') {
            return false;
        }
    }

    return true;
}