import {useEffect, useState} from "react";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import LogDebugRow from "./LogDebugRow.jsx";
import {getLogTime} from "../log_utils.js";
import {LogLevel} from "./LogLevel.jsx";
import MoreIcon from "./MoreIcon.jsx";
import RowExtras from "./RowExtras.jsx";

export default function LogView({logs}) {

    if (logs.length === 0) {
        return (
            <h1 className={"text-gray-600 text-center font-bold"}>No logs to view</h1>
        )
    }

    return (
        <>
            <div className={"border-b-2"}>
                <div className={"grid grid-cols-7 p-2 font-bold"}>
                    <div className={"col-span-1"}>Timestamp</div>
                    <div className={"col-span-1"}>Log Level</div>
                    <div className={"col-span-1 text-center"}>Task Type</div>
                    <div className={"col-span-3"}>Message</div>
                    <div className={"col-span-1 text-end"}>Extra Data</div>
                </div>
            </div>
            {logs.map((log, index) => (
                log.log_level === 'TASK_STATUS' ?
                    <LogTaskStatusRow key={index} info={log} />
                    :
                    <LogDebugRow key={index} info={log} />
            ))}
        </>
    )

}
