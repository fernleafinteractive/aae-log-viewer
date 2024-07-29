import {socket} from "./socket.js";

import SAMPLE_LOG from '../test_data/test.json';

import LogView from "./components/LogView.jsx";
import {useEffect, useState} from "react";
import {DropdownFilter} from "./components/DropdownFilter.jsx";
import FilterBar from "./components/FilterBar.jsx";


function App() {

    const [logs, setLogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");

    const [connected, setConnected] = useState(false);

    function filterLogs(_logs, filter) {
        if(statusFilter === "" || statusFilter === "All") {
            return _logs;
        }

        return _logs.filter(log => log.log_level === statusFilter);
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

          <FilterBar setStatusFilter={setStatusFilter} connected={connected} />

          <LogView logs={filterLogs(logs, statusFilter)} />
      </div>
  )
}

export default App
