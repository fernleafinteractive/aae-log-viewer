import {createContext, useContext, useState} from "react";
import {LogData, LogLevel} from "../types/log_type";

type LogDataContextType = {
    logs: LogData[];
    setLogs: (logs: LogData[]) => void;
}

export const LogDataContext = createContext<LogDataContextType>(null);

export const LogDataContextProvider = ({children}) => {

    const [state, setState] = useState<LogData[]>([]);

    const setLogs = (logs: LogData[]) => {
        setState([...state, ...logs]);
    }

    return (
        <LogDataContext.Provider value={{logs: state, setLogs: setLogs}}>
            {children}
        </LogDataContext.Provider>
    )
}

export const useLogData = () => {
    const logDataContext = useContext(LogDataContext);
    if(logDataContext === null) {
        throw Error("useLogData is not being used inside a LogDataContext Provider.");
    }
    return logDataContext;
}