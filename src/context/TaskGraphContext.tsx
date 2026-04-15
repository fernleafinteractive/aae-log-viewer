import {createContext, useContext, useState} from "react";
import {TaskGraphType, TaskGraphNodeType, TaskGraphEdgeType} from "../types/task_graph_types";

type TaskGraphContextType = {
    data: TaskGraphType;
    setTaskGraph: (data: TaskGraphType) => void;
}

export const TaskGraphContext = createContext<TaskGraphContextType>(null);

export const TaskGraphContextProvider = ({children}) => {

    const [state, setState] = useState<TaskGraphType>(null);

    const setTaskGraph = (data: TaskGraphType) => {
        setState(data);
    }

    return (
        <TaskGraphContext.Provider value={{data: state, setTaskGraph: setTaskGraph}}>
            {children}
        </TaskGraphContext.Provider>
    )
}

export const useTaskGraph = () => {
    const taskGraphContext = useContext(TaskGraphContext);
    if(taskGraphContext === null) {
        throw Error("useTaskGraph is not being used inside a TaskGraphContext Provider.");
    }
    return taskGraphContext;
}