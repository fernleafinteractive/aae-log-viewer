export function getLogInfo() {

}

export function getLogTime(time) {
    return new Date(parseInt(time) * 1000).toLocaleString();
}