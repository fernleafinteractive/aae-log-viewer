export function getLogInfo() {

}

export function getLogTime(time) {
    return new Date(parseInt(time) * 1000).toLocaleString();
}

export function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.toLocaleString();
}