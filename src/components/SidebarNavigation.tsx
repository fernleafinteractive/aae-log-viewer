export default function SidebarNavigation({setView}) {
    return (
        <div className={"sidebar-navigation h-screen border-2 border-black p-4"}>
            <div>
                <ul className={"whitespace-nowrap text-left"}>
                    <li className={"m-2"} onClick={()=>setView("LOGS")}>Logs</li>
                    <li className={"m-2"} onClick={()=>setView("TASK_EXECUTION")}>Task Execution</li>
                    <li className={"m-2"} onClick={()=>setView("MEMORY_VIEW")}>Memory View</li>
                    <li className={"m-2"} onClick={()=>setView("TASK_GRAPH")}>Task Graph</li>
                </ul>
            </div>
        </div>
    )
}
