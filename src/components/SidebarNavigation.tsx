export default function SidebarNavigation() {
    return (
        <div className={"sidebar-navigation h-screen border-2 border-black p-4"}>
            <div>
                <ul className={"whitespace-nowrap text-left"}>
                    <li className={"m-2"}>Logs</li>
                    <li className={"m-2"}>Task Execution</li>
                    <li className={"m-2"}>Memory View</li>
                    <li className={"m-2"}>Task Graph</li>
                </ul>
            </div>
        </div>
    )
}
