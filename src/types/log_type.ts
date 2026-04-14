export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "TASK_STATUS" | "UNKNOWN";

export type LogData = {
    json_params: Object;
    log_level: LogLevel;
    message: string;
    thread_id: string;
}

export type LogDataMappingContextType = {
    mapping: Object;
    totalExecutionTime: number;
    setMapping: (data: Object) => void;
}