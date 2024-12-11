export function getTaskExecutionTime(data) {
    const timestamps = data.map(d => d.data.timestamp);
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);

    return max - min;
}

export function didTaskFail(data) {
    for(const task of data) {
        if (task.data.task_status === 'FAILED') {
            return true;
        }
    }

    return false;
}

export function isTaskRunning(data) {
    for(const task of data) {
        if (task.data.task_status === 'COMPLETE' || task.data.task_status === 'FAILED') {
            return false;
        }
    }

    return true;
}