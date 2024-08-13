import {useEffect, useState} from "react";

import {socket} from "./socket.js";

import Views from "./components/Views.jsx";
import {stringToColor} from "./log_utils.js";

function App() {

    const [logs, setLogs] = useState([]);

    const [connected, setConnected] = useState(false);

    useEffect(() => {


        // setLogs(SAMPLE_LOG);

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

    const fileSelect = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const text = await file.text();
        const json = JSON.parse(text);

        const output = [];
        for(const k of Object.keys(json)) {
            const oldObject = json[k];
            const newObject = {};
            delete Object.assign(newObject, oldObject, {["data"]: oldObject["json_params"] })["json_params"];
            output.push(newObject);
        }
        setLogs(output);
    }

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
