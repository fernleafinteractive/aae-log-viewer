import {useCallback, useEffect, useState} from "react";

import FilterBar from "./FilterBar.jsx";
import LogView from "./LogView.jsx";
import TaskTimings from "./TaskTimings.jsx";
import {socket} from "../socket.js";

export default function Views() {

    const [logs, setLogs] = useState([]);
    const [connected, setConnected] = useState(false);

    const [worker, setWorker] = useState(null);

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
        if(worker === null) {
            console.error("worker is not setup");
            return;
        }

        e.preventDefault();
        if(e.target.files.length === 0) return;

        worker.postMessage(e.target.files);

    }, [worker]);

    useEffect(() => {

        const myWorker = new Worker(new URL(".././workers/input_worker.js", import.meta.url));

        myWorker.onmessage = (event) => {
            setLogs(event.data);
        }

        setWorker(myWorker);

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

            myWorker.terminate();
        }
    }, []);

    return (
        <div>
            <FilterBar logs={logs} statusFilter={statusFilter} setStatusFilter={setStatusFilter} setTaskFilter={setTaskFilter} setMessageFilter={setMessageFilter} connected={connected} fileSelect={fileSelect} logView={logView} setLogView={setLogView} />

            <div>
                {
                    logView ?
                        <LogView logs={filterLogs(logs, statusFilter, taskFilter, messageFilter)} />
                        :
                        <TaskTimings logs={filterLogs(logs, statusFilter, taskFilter, messageFilter)} />
                }
            </div>
        </div>
    )

}