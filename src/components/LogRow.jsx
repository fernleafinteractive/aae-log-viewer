import {useState} from "react";

export default function LogRow({info}) {
    const [showExtra, setShowExtra] = useState(false);

    console.log(info);

    return (
        <>
            <div className={"log-row"}>
                <div>{info.timestamp}</div>
                <div>{info.log_level}</div>
                <div>{info.message}</div>
                <div>...</div>
            </div>
            <RowExtras params={info.json_params} active={showExtra} />
        </>

    )
}

function RowExtras({params, active}) {
    return (
        <>
            <div>
                {Object.keys(params).map((p, index) => (
                    <div key={index}>
                        {p} {typeof params[p] === 'object' ? JSON.stringify(params[p]) : params[p]}
                    </div>
                ))}
            </div>
        </>
    )
}