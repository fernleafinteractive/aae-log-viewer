import {useEffect, useState} from "react";
import LogTaskStatusRow from "./LogTaskStatusRow.jsx";
import LogDebugRow from "./LogDebugRow.jsx";

export default function LogView({logs}) {

    if (logs.length === 0) {
        return (
            <h1 className={"text-gray-600 text-center font-bold"}>No logs to view</h1>
        )
    }

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
