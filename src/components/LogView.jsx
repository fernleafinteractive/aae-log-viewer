import SAMPLE_LOG from '../../test_data/sample_log_file.json';
import {useEffect, useState} from "react";
import LogRow from "./LogRow.jsx";

export default function LogView({logs}) {

    useEffect(() => {
        console.log("view", logs);
    }, [logs])

    return (
        <>
            {logs.map((log, index) => (
               <LogRow key={index} info={log} />
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