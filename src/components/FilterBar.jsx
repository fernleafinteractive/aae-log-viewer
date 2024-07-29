import {DropdownFilter} from "./DropdownFilter.jsx";
import {socket} from "../socket";
import {useEffect} from "react";

export default function FilterBar({setStatusFilter, connected}) {

    return (
        <div className={"flex items-center my-4 py-4 border-b-2"}>
            <DropdownFilter setStatusFilter={setStatusFilter} />

            <div className={"flex items-center justify-between bg-gray-200 p-2 rounded-md ms-auto"}>Connection <div className={`p-1 animate-pulse rounded-[180px] ${connected ? 'bg-green-500' : 'bg-red-500'} ms-2`}></div></div>
        </div>
    )

}