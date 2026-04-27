import {useContext, useEffect, useState} from "react";
import Chart from "react-apexcharts";

import {LogDataContext, useLogData} from "../context/LogDataContext";

import ErrorIcon from "./icons/ErrorIcon.jsx";
import LoadingIcon from "./icons/LoadingIcon.jsx";
import ChevronUpIcon from "./icons/ChevronUpIcon.jsx";
import ChevronDownIcon from "./icons/ChevronDownIcon.jsx";

import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import {formatDuration, stringToColor} from "../utils/log_utils.js";
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
        <div className={"overflow-y-auto p-4 bg-[#272B34] rounded-[0.25rem]"}>
            <h1 className={"text-xl mb-4 bg-[#3A3E47] p-2 rounded"}>Total execution time: <span className={"font-bold text-white"}>{formatDuration(totalExecutionTime)}</span></h1>

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

    const borderColor = stringToColor(taskId);
    return (
        <div className={`mb-4 ${showTimings ? `rounded-[0.25rem] p-2 bg-[#363A45]` : ''}`}>
            <div className={"flex items-center"}>
                <div className={`p-2 rounded me-4`} style={{backgroundColor: borderColor}}></div>
                <div className={`me-4 flex items-center ${showTimings ? `text-white` : ''}`}>
                    {taskId}
                    {didTaskFail(tasks) ? <span title={"task failed"} className={"text-red-500 ms-4"}><ErrorIcon /></span>
                        : ''}
                </div>
                <div className={"ms-auto me-4 text-white"}>{isTaskRunning(tasks) ?
                    <LoadingIcon/> : formatDuration(getTaskExecutionTime(tasks))}</div>
                <button className={"ms-4"} onClick={() => {
                    setShowTimings(!showTimings)
                }}>
                    {showTimings ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                </button>

            </div>
            <div className={!showTimings ? 'hidden border-0' : 'border-s-2 ms-1.5 ps-2'} style={{borderColor:  borderColor, maxHeight: '15rem', overflowY: 'auto'}}>
                {tasks.map((v, index) => (
                    <LogTaskStatusRow info={v} key={index}/>
                ))}
            </div>
        </div>
    )

}