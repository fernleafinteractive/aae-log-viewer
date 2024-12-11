import {useState} from "react";
import {stringToColor} from "../log_utils.js";
import ErrorIcon from "./ErrorIcon.jsx";
import Loading from "./Loading.jsx";
import ChevronUp from "./ChevronUp.jsx";
import ChevronDown from "./ChevronDown.jsx";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";

import {didTaskFail, isTaskRunning, getTaskExecutionTime} from "../utils/task_utils.js";

export default function TaskTimings({mapping, totalExecutionTime}) {

    if(mapping.length === 0) {
        return (
        <div className={"flex flex-1 items-center justify-center"}>
            No data
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

