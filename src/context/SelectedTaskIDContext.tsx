import {createContext, useContext, useState} from "react";
import {LogDataType, LogLevel} from "../types/log_types";

type SelectedTaskIDContextType = {
    taskID: String;
    setTaskID: (logs: String) => void;
}

export const SelectedTaskIDContext = createContext<SelectedTaskIDContextType>(null);

export const SelectedTaskIDContextProvider = ({children}) => {

    const [state, setState] = useState<String>("");

    return (
        <SelectedTaskIDContext.Provider value={{taskID: state, setTaskID: setState}}>
            {children}
        </SelectedTaskIDContext.Provider>
    )
}

export const useSelectedTaskID = () => {
    const taskIDContext = useContext(SelectedTaskIDContext);
    if(taskIDContext === null) {
        throw Error("useSelectedTaskID is not being used inside a SelectedTaskIDContext Provider.");
    }
    return taskIDContext;
}