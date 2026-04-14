import {createContext, useContext, useState} from "react";
import {LogDataMappingContextType} from '../types/log_type';

type MappingInput = {
    mapping: Object[],
    totalExecutionTime: number
}

export const LogDataMappingContext = createContext<LogDataMappingContextType>(null)

export const LogDataMappingContextProvider = (props) => {
    const [state, setState] = useState({
        mapping: [],
        totalExecutionTime: 0
    })

    const setMapping = (data : MappingInput) => {
        console.log(data)
        setState({
            mapping: data.mapping,
            totalExecutionTime: data.totalExecutionTime
        });
    }

    return (
        <LogDataMappingContext.Provider value={{mapping: state.mapping, totalExecutionTime: state.totalExecutionTime, setMapping: setMapping}}>
            {props.children}
        </LogDataMappingContext.Provider>
    )
}

export const useLogDataMapping = () => {
    const logMappingContext = useContext(LogDataMappingContext);
    if(logMappingContext === null){
        throw Error("useLogDataMapping must be used inside a LogDataMappingContext.Provider");
    }

    return logMappingContext;
}