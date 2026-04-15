export type TaskGraphEdgeType = {
    data: {
        source: string;
        target: string;
    }
}

export type TaskGraphNodeType = {
    data: Object;
}

export type TaskGraphType = {
    elements: {
        edges: TaskGraphEdgeType[];
        nodes: TaskGraphNodeType[];
    }
}