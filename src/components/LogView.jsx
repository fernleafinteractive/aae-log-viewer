import SAMPLE_LOG from '../../test_data/sample_log_file.json';
import {useState} from "react";
import LogRow from "./LogRow.jsx";

export default function LogView() {

    const [logKeys, setLogKeys] = useState(Object.keys(SAMPLE_LOG));

    return (
        <>
            {Object.keys(SAMPLE_LOG).map((log, index) => (
               <LogRow key={index} info={buildInfo(SAMPLE_LOG[log])} />
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