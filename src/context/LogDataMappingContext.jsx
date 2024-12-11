import {createContext, useState} from "react";

export const LogDataMappingContext = createContext({
    data: {
        mapping: [],
        totalElements: 0,
    },
    setData: () => {}
})

export const LogDataMappingContextProvider = (props) => {

    const setData = (data) => {
        setState({...state, data: data})
    }

    const initState = {
        data: {
            mapping: [],
            totalElements: 0,
        },
        setData: setData
    }

    const [state, setState] = useState(initState)

    return (
        <LogDataMappingContext.Provider value={state}>
            {props.children}
        </LogDataMappingContext.Provider>
    )
}