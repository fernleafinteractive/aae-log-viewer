import {createContext, useContext, useState} from "react";
import {LogDataType, LogLevel} from "../types/log_types";

type LogDataContextType = {
    logs: LogDataType[];
    setLogs: (logs: LogDataType[]) => void;
}

export const LogDataContext = createContext<LogDataContextType>(null);

export const LogDataContextProvider = ({children}) => {

    const [state, setState] = useState<LogDataType[]>([]);

    const setLogs = (logs: LogDataType[]) => {
        console.log("set logs", logs);
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