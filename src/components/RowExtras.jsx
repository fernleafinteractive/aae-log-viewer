export default function RowExtras({params, active}) {
    return (
        <div className={active ? "block" : "hidden"}>
            {Object.keys(params).map((p, index) => (
                <div key={index}>
                    {p} {typeof params[p] === 'object' ? JSON.stringify(params[p]) : params[p]}
                </div>
            ))}
        </div>
    )
}