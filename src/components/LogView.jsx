import {useEffect, useState} from "react";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import LogDebugRow from "./LogDebugRow.jsx";

export default function LogView({logs}) {

    return (
        <>
            {logs.map((log, index) => (
                log.log_level === 'TASK_STATUS' ?
                    <LogTaskStatusRow key={index} info={log} />
                    :
                    <LogDebugRow key={index} info={log} />
            ))}
        </>
    )

}

function getLogTime(key) {
    return new Date(parseInt(key)).toLocaleString();
}

function buildInfo(logData) {

    return {
        timestamp: getLogTime(logData.json_params.timestamp),
        message: logData.message,
        log_level: logData.log_level,
        json_params: logData.json_params
    }
}