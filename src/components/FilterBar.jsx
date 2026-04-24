import InputFilter from "./InputFilter.jsx";
import DropdownFilter from "./DropdownFilter.jsx";
import UploadIcon from "./icons/UploadIcon.jsx";

export default function FilterBar({logs, statusFilter, setStatusFilter, setTaskFilter, connected, setMessageFilter, logView, setLogView}) {

    const filterOptions = [
        {
            id: "ALL",
            name: "All"
        },
        {
            id: "DEBUG",
            name: "Debug"
        },
        {
            id: "TASK_STATUS",
            name: "Task Status"
        },
        {
            id: "ERROR",
            name: "Error"
        }
    ];
    const taskFilterOptions = [
        {
            id: "ALL",
            name: "All"
        },
        {
            id: "IDLE",
            name: "Idle"
        },
        {
            id: "SKIPPED",
            name: "Skipped"
        },
        {
            id: "STARTED",
            name: "Started"
        },
        {
            id: "COMPLETE",
            name: "Complete"
        },
        {
            id: "RUNNING",
            name: "Running"
        },
        {
            id: "FAILED",
            name: "Failed"
        }
    ];

    return (
        <div className={"flex items-center p-4 bg-[#272B34] mb-4"}>
            <DropdownFilter filterOptions={filterOptions} setStatusFilter={setStatusFilter} />
            {
                statusFilter === "TASK_STATUS" ?
                    <DropdownFilter filterOptions={taskFilterOptions} setStatusFilter={setTaskFilter} />
                    :
                    <></>
            }
            <InputFilter setMessageFilter={setMessageFilter} />

            <div className={"ms-4 p-1 flex items-center bg-[#303540] rounded"}>
                <div className={"rounded-md text-[#b0b3b7] p-1"}>{logs.length} Logs</div>
                <div className={"ms-4 me-2 rounded-md text-white flex items-center bg-green-400 px-4 py-1"}>
                    {logs.filter(l => l.log_level === 'TASK_STATUS' && l.data.task_status === 'COMPLETE').length}
                </div>
                <div className={"rounded-md text-white text-center flex items-center bg-red-400 px-4 py-1"}>
                    {logs.filter(l => l.log_level === 'TASK_STATUS' && l.data.task_status === 'FAILED').length}
                </div>
            </div>
        </div>
    )

}