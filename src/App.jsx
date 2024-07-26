import {socket} from "./socket.js";

import LogView from "./components/LogView.jsx";
import {useEffect, useState} from "react";

function App() {

    const [logs, setLogs] = useState([]);
    
    useEffect(() => {

        function onConnect() {
            console.log("connected");
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
        socket.on('data', onData);

        return () => {
            socket.off('connect', onConnect);
            socket.off('data', onData);
        }
    }, []);

  return (
    <div style={{height: '100%'}}>
        <LogView logs={logs} />
    </div>
  )
}

export default App
