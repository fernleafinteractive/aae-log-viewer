import {useState} from "react";
import {getLogTime} from "../log_utils.js";
import MoreIcon from "./MoreIcon.jsx";
import RowExtras from "./RowExtras.jsx";
import {LogLevel} from "./LogLevel.jsx";

export default function LogDebugRow({info}) {
    const [showExtra, setShowExtra] = useState(false);

    return (
        <div className={"border-b-2"}>
            <div className={"grid grid-cols-6 p-2"}>
                <div className={"col-span-1"}>{getLogTime(info["data"].timestamp)}</div>
                <div className={"col-span-1"}><LogLevel logLevel={info.log_level} /></div>
                <div className={"col-span-3"}>{info.message}</div>
                <div className={"col-span-1 flex items-center justify-end hover:cursor-pointer text-gray-400"} onClick={() => setShowExtra(!showExtra)}>
                    <MoreIcon />
                </div>
            </div>
            <RowExtras params={info.data} active={showExtra} />
        </div>

    )
}

