import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import {LogDataType, LogLevel} from "../types/log_types";
import {useLogData} from "./LogDataContext";

type FileInputWorkerContextType = {
    worker: Worker;
    setWorker: (worker: Worker) => void;
}

export const FileInputWorkerContext = createContext<FileInputWorkerContextType>(null);

export const FileInputWorkerContextProvider = ({children}: {children : ReactNode}) => {

    const [worker, setWorker] = useState<Worker>(() => new Worker(new URL("../workers/input_worker.js", import.meta.url)));

    const {logs, setLogs} = useLogData();

    useEffect(() => {

        console.log("FileProvider");

        if(worker === null) {
            console.log("worker is null");
        }

        worker.onmessage = (event) => {
            console.log("worker on message");
            setLogs(event.data);
        }

        return () => {
            console.log("worker terminate");
            worker.terminate();
        }
    }, [worker]);

    return (
        <FileInputWorkerContext.Provider value={{worker: worker, setWorker: setWorker}}>
            {children}
        </FileInputWorkerContext.Provider>
    )
}

export const useFileInputWorker = () => {
    const workerContext = useContext(FileInputWorkerContext);
    if(workerContext === null) {
        throw Error("useFileInputWorker is not being used inside a FileInputWorkerContext Provider.");
    }
    return workerContext;
}