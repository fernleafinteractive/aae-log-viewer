

export function LogLevel({logLevel}) {
    return (
        <div>
            {friendlyLogLevel(logLevel)}
        </div>

    )
}

function friendlyLogLevel(logLevel) {
    switch (logLevel) {
        case 'DEBUG':
            return <div className={"bg-gray-400 text-white max-w-[10rem] text-center rounded-md"}>Debug</div>;
        case 'ERROR':
            return <div className={"bg-red-400 text-white max-w-[10rem] text-center rounded-md"}>Error</div>;
        case 'IDLE':
            return <div className={"bg-orange-400 text-white max-w-[10rem] text-center rounded-md"}>Idle</div>;
        case 'STARTED':
            return <div className={"bg-purple-400 text-white max-w-[10rem] text-center rounded-md"}>Started</div>;
        case 'COMPLETE':
            return <div className={"bg-green-400 text-white max-w-[10rem] text-center rounded-md"}>Complete</div>;
        case 'RUNNING':
            return <div className={"bg-blue-400 text-white max-w-[10rem] text-center rounded-md"}>Running</div>;
        case 'FAILED':
            return <div className={"bg-red-400 text-white max-w-[10rem] text-center rounded-md"}>Task Failed</div>;
    }
}