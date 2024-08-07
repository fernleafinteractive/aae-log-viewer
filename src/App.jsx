import {useEffect, useState} from "react";

import {socket} from "./socket.js";
import SAMPLE_LOG from '../test_data/test.json';

import LogView from "./components/LogView.jsx";
import FilterBar from "./components/FilterBar.jsx";
import Views from "./components/Views.jsx";

function App() {

    const [logs, setLogs] = useState([]);

    const [connected, setConnected] = useState(false);

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

          <Views
              logs={logs}
              connected={connected}
          />
      </div>
  )
}

export default App
