// handles converting logs to a mapping of timing reports
onmessage = function(e) {

    const logs = e.data;

    if(logs.length === 0) {
        postMessage({
            mapping: [],
            totalExecutionTime: 0
        });
        return;
    }

    const mapping = groupTasksById(logs);
    const totalExecutionTime = getTotalExecutionTime(mapping);

    postMessage({
        mapping,
        totalExecutionTime
    });
}


function groupTasksById(logs) {
    const filtered = logs.filter(log => log.log_level === 'TASK_STATUS');
    const map = new Map();

    for (const log of filtered) {
        const taskId = log.data.data.task_id;
        if (!map.has(taskId)) {
            map.set(taskId, []);
        }

        map.get(taskId).push(log);
    }

    let s = new Map([...map.entries()].sort((a, b) => {
        return getTaskExecutionTime(b[1]) - getTaskExecutionTime(a[1]);
    }))

    return Array.from(s, ([key, value]) => ({key, value}));
}

function getTaskExecutionTime(data) {
    const timestamps = data.map(d => d.data.timestamp);
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);

    return max - min;
}

function getTotalExecutionTime(data) {
    let sum = 0;
    for(const d of data) {
        sum += getTaskExecutionTime(d.value);
    }
    return sum;
}
