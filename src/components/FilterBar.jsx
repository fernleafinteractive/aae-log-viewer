import InputFilter from "./InputFilter.jsx";
import DropdownFilter from "./DropdownFilter.jsx";
import UploadIcon from "./UploadIcon.jsx";

export default function FilterBar({logs, setStatusFilter, connected, setMessageFilter, fileSelect, logView, setLogView}) {

    return (
        <div className={"flex items-center my-4 py-4 border-b-2"}>
            <DropdownFilter setStatusFilter={setStatusFilter} />
            <InputFilter setMessageFilter={setMessageFilter} />

            <div className={"ms-4 p-1 flex items-center bg-gray-300 rounded"}>
                <div className={"rounded-md text-white p-1"}>{logs.length} Logs</div>
                <div className={"ms-4 me-2 rounded-md text-white flex items-center bg-green-400 px-4 py-1"}>
                    {logs.filter(l => l.log_level === 'TASK_STATUS' && l.data.task_status === 'COMPLETE').length}
                </div>
                <div className={"rounded-md text-white text-center flex items-center bg-red-400 px-4 py-1"}>
                    {logs.filter(l => l.log_level === 'TASK_STATUS' && l.data.task_status === 'FAILED').length}
                </div>
            </div>

            <label className="inline-flex items-center cursor-pointer ms-4">
                <input type="checkbox" value="" className="sr-only peer" onChange={() => setLogView(!logView)} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{logView ? 'Log View' : 'Timings View'}</span>
            </label>

            <label className="ms-auto me-4 text-white font-semibold px-3 py-2 rounded-md bg-gray-500 hover:bg-gray-600 hover:cursor-pointer ring-1 ring-gray-500 focus-within:ring-2 focus-within:ring-indigo-500" aria-label={"Upload log file"}>
                <UploadIcon />
                <input type="file" className="focus:outline-none hidden" onChange={fileSelect} />
            </label>
            <div className={"flex items-center justify-between bg-gray-200 p-2 rounded-md"}>
                Connection <div className={`p-1 animate-pulse rounded-[180px] ${connected ? 'bg-green-500' : 'bg-red-500'} ms-2`}></div>
            </div>
        </div>
    )

}