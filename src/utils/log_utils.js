export function formatDuration(timestamp) {
    const totalSeconds = Math.floor(timestamp / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if(hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${hours > 1 ? 'hours' : 'hour'}`;
    if(minutes > 0) return `${pad(minutes)}:${pad(seconds)} ${minutes > 1 ? 'minutes' : 'minute'}`;

    return `${pad(seconds)} ${seconds > 1 ? 'seconds' : 'second'}`;
}

export function getLogTime(time) {
    return new Date(time).toLocaleString();
}

export function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.toLocaleString();
}
export function stringToColor(str) {
    // Generate a simple hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to RGB values
    let r = (hash >> 16) & 0xFF;
    let g = (hash >> 8) & 0xFF;
    let b = hash & 0xFF;

    // Convert RGB values to a hex color code
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}