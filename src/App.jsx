import {useEffect, useState} from "react";

import {socket} from "./socket.js";
import SAMPLE_LOG from '../test_data/test.json';

import LogView from "./components/LogView.jsx";
import FilterBar from "./components/FilterBar.jsx";

function App() {

    const [logs, setLogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [messageFilter, setMessageFilter] = useState("");

    const [connected, setConnected] = useState(false);

    function filterLogs(logs, filter, message) {
        let _logs = [];
        if(filter.length !== 0 && filter !== "All") {
            _logs = logs.filter(log => log.log_level === filter);
        } else {
            _logs = [...logs];
        }

        if(message.length > 0) {
            _logs = _logs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
        }

        return _logs;
    }

    useEffect(() => {

        setLogs(SAMPLE_LOG);

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
        }
    }, []);

  return (
      <div className={"px-24"} style={{height: '100%'}}>

          <FilterBar setStatusFilter={setStatusFilter} setMessageFilter={setMessageFilter} connected={connected} />

          <LogView logs={filterLogs(logs, statusFilter, messageFilter)} />
      </div>
  )
}

export default App
