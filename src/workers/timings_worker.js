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

    const taskLogData = logs.filter(log => log.log_level === 'TASK_STATUS');
    const taskMapping = new Map();

    let minTimestamp = Number.MAX_VALUE;
    let maxTimestamp = Number.MIN_VALUE;

    for(const taskLog of taskLogData) {
        const taskId = taskLog.data.data.task_id;
        const timestamp = taskLog.data.timestamp;

        minTimestamp = Math.min(minTimestamp, timestamp);
        maxTimestamp = Math.max(maxTimestamp, timestamp);

        if (!taskMapping.has(taskId)) {
            taskMapping.set(taskId, []);
        }

        taskMapping.get(taskId).push(taskLog);
    }

    let sortedByExecutionMapping = new Map([...taskMapping.entries()].sort((a, b) => {
        return getTaskExecutionTime(b[1]) - getTaskExecutionTime(a[1]);
    }))

    // const mapping = Array.from(sortedByExecutionMapping, ([key, value]) => ({key, value}));
    const totalExecutionTime = maxTimestamp - minTimestamp;

    postMessage({
        mapping: sortedByExecutionMapping,
        totalExecutionTime
    });

    console.log("Loaded timings data");
}

function getTaskExecutionTime(data) {
    const timestamps = data.map(d => d.data.timestamp);
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);

    return max - min;
}
