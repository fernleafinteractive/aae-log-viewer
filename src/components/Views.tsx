import {useCallback, useContext, useEffect, useState} from "react";

import {useLogData} from "../context/LogDataContext";
import {useLogDataMapping} from "../context/LogDataMappingContext";

import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import TaskTimings from "./TaskTimings.jsx";
import {socket} from "../socket.js";

export default function Views() {

    const {logs, setLogs} = useLogData();
    // const {worker} = useFileInputWorker();

    const {mapping, totalExecutionTime, setMapping} = useLogDataMapping();

    const [connected, setConnected] = useState(false);

    const [mappingWorker, setMappingWorker] = useState(null);

    const [logView, setLogView] = useState(true);

    const [statusFilter, setStatusFilter] = useState("");
    const [taskFilter, setTaskFilter] = useState("");
    const [messageFilter, setMessageFilter] = useState("");

    function filterLogs(logs, filter, tFilter, message) {
        let _logs = [];
        if(filter.length !== 0 && filter !== "ALL") {
            _logs = logs.filter(log => log.log_level === filter);
        } else {
            _logs = [...logs];
        }

        if(filter === "TASK_STATUS") {
            if(tFilter.length !== 0 && tFilter !== "ALL") {
                _logs = _logs.filter(log => log.data.task_status === tFilter);
            }
        }

        if(message.length > 0) {
            _logs = _logs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
        }

        return _logs;
    }

    useEffect(() => {

        const myMappingWorker = new Worker(new URL("./../workers/timings_worker.js", import.meta.url));


        myMappingWorker.onmessage = (event) => {
            const data = {
                mapping: event.data.mapping,
                totalExecutionTime: event.data.totalExecutionTime
            }

            setMapping({
                mapping: data.mapping,
                totalExecutionTime: data.totalExecutionTime
            });
        }

        setMappingWorker(myMappingWorker);

        function onConnect() {
            console.log("connected");
            setConnected(true);
        }

        function onDisconnect() {
            console.log("disconnected");
            setConnected(false);
        }

        function onData(data) {
            try {
                const jsonData = JSON.parse(data);
                setLogs((prevLogs) => [...prevLogs, jsonData]);
            } catch(e) {
                console.error(data);
            }
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('data', onData);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('data', onData);

            myMappingWorker.terminate();
        }
    }, []);

    useEffect(() => {
        if(mappingWorker === null || logs.length === 0) return;

        mappingWorker.postMessage(logs);

    }, [logs, mappingWorker]);

    return (
        <>
            <FilterBar logs={logs} statusFilter={statusFilter} setStatusFilter={setStatusFilter} setTaskFilter={setTaskFilter} setMessageFilter={setMessageFilter} connected={connected} logView={logView} setLogView={setLogView} />

            <div className={"overflow-y-auto bg-[#272B34] p-4 rounded-[0.25rem] grow"}>
                <LogView logs={filterLogs(logs, statusFilter, taskFilter, messageFilter)} />
            </div>
        </>
    )

}