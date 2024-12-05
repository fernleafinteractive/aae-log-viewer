import {useCallback, useEffect, useState} from "react";
import {socket} from "./socket.js";
import Views from "./components/Views.jsx";
import TaskGraph from "./components/TaskGraph.jsx";

function App() {

    const [logs, setLogs] = useState([]);
    const [connected, setConnected] = useState(false);

    const [worker, setWorker] = useState(null);

    useEffect(() => {

        const myWorker = new Worker(new URL("./workers/input_worker.js", import.meta.url));

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

    const fileSelect = useCallback(async (e) => {
        if(worker === null) {
            console.error("worker is not setup");
            return;
        }

        e.preventDefault();
        if(e.target.files.length === 0) return;

        worker.postMessage(e.target.files);

    }, [worker]);

  return (
      <div className={"px-24"} style={{height: '100%'}}>

          <TaskGraph />

          <Views
              logs={logs}
              connected={connected}
              fileSelect={fileSelect}
          />
      </div>
  )
}

export default App
