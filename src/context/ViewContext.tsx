import {createContext, useContext, useState} from "react";
import {ViewType} from "../types/view_types";

type ViewContextType = {
    view: ViewType;
    setView: (v: ViewType) => void;
}

export const ViewContext = createContext<ViewContextType>(null);

export const ViewContextProvider = ({children}) => {

    const [state, setState] = useState<ViewType>("LOGS");

    return (
        <ViewContext.Provider value={{view: state, setView: setState}}>
            {children}
        </ViewContext.Provider>
    )
}

export const useView = () => {
    const viewContext = useContext(ViewContext);
    if(viewContext === null) {
        throw Error("useView is not being used inside a ViewContext Provider.");
    }
    return viewContext;
}