import {useCallback, useContext, useEffect, useState} from "react";

import {LogDataContext} from "../context/LogDataContext.jsx";

import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import TaskTimings from "./TaskTimings.jsx";
import {socket} from "../socket.js";
import {LogDataMappingContext} from "../context/LogDataMappingContext.jsx";

export default function Views() {

    const logContext = useContext(LogDataContext);
    const mappingContext = useContext(LogDataMappingContext);

    const [connected, setConnected] = useState(false);

    const [inputWorker, setInputWorker] = useState(null);
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

    const fileSelect = useCallback(async (e) => {
        if(inputWorker === null) {
            console.error("worker is not setup");
            return;
        }

        e.preventDefault();
        if(e.target.files.length === 0) return;

        inputWorker.postMessage(e.target.files);

    }, [inputWorker]);

    useEffect(() => {

        const myInputWorker = new Worker(new URL(".././workers/input_worker.js", import.meta.url));
        const myMappingWorker = new Worker(new URL("./../workers/timings_worker.js", import.meta.url));


        myInputWorker.onmessage = (event) => {
            logContext.setLogs(event.data);
        }

        myMappingWorker.onmessage = (event) => {
            const data = {
                mapping: event.data.mapping,
                totalExecutionTime: event.data.totalExecutionTime
            }

            mappingContext.setData(data);
        }

        setInputWorker(myInputWorker);
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
                logContext.setLogs((prevLogs) => [...prevLogs, jsonData]);
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

            myInputWorker.terminate();
            myMappingWorker.terminate();
        }
    }, []);

    useEffect(() => {
        if(mappingWorker === null || logContext.logs.length === 0) return;

        mappingWorker.postMessage(logContext.logs);

    }, [logContext.logs, mappingWorker]);

    return (
        <div>
            <FilterBar logs={logContext.logs} statusFilter={statusFilter} setStatusFilter={setStatusFilter} setTaskFilter={setTaskFilter} setMessageFilter={setMessageFilter} connected={connected} fileSelect={fileSelect} logView={logView} setLogView={setLogView} />

            <div>
                {
                    logView ?
                        <LogView logs={filterLogs(logContext.logs, statusFilter, taskFilter, messageFilter)} />
                        :
                        <TaskTimings mapping={mappingContext.data.mapping} totalExecutionTime={mappingContext.data.totalExecutionTime} />
                }
            </div>
        </div>
    )

}