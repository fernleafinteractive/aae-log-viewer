import {socket} from "../socket";
import {useEffect} from "react";
import InputFilter from "./InputFilter.jsx";
import DropdownFilter from "./DropdownFilter.jsx";

export default function FilterBar({setStatusFilter, connected, setMessageFilter}) {

    return (
        <div className={"flex items-center my-4 py-4 border-b-2"}>
            <DropdownFilter setStatusFilter={setStatusFilter} />
            <InputFilter setMessageFilter={setMessageFilter} />
            <div className={"flex items-center justify-between bg-gray-200 p-2 rounded-md ms-auto"}>
                Connection <div className={`p-1 animate-pulse rounded-[180px] ${connected ? 'bg-green-500' : 'bg-red-500'} ms-2`}></div>
            </div>
        </div>
    )

}