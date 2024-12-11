import {createContext, useState} from "react";

export const LogDataContext = createContext({
    logs: [],
    setLogs: () => {}
})

export const LogDataContextProvider = (props) => {

    const setLogs = (logs) => {
        setState({...state, logs: logs})
    }

    const initState = {
        logs: [],
        setLogs: setLogs
    }

    const [state, setState] = useState(initState)

    return (
        <LogDataContext.Provider value={state}>
            {props.children}
        </LogDataContext.Provider>
    )
}