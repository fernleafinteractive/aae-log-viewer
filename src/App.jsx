import {useCallback, useEffect, useState} from "react";
import {socket} from "./socket.js";
import Views from "./components/Views.jsx";

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

        const file = e.target.files[0];
        const text = await file.text();
        const json = JSON.parse(text);
        worker.postMessage(json);

    }, [worker]);

  return (
      <div className={"px-24"} style={{height: '100%'}}>

          <Views
              logs={logs}
              connected={connected}
              fileSelect={fileSelect}
          />
      </div>
  )
}

export default App
