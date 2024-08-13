export default function RowExtras({params, active}) {
    return (
        <div className={active ? "block" : "hidden"}>
            {Object.keys(params).map((p, index) => (
                <div key={index} className={`ms-4 ${typeof params[p] === 'object' ? '' : 'flex'}`}>
                    <div className={"font-bold me-2"}>{p}:</div>
                    <div>
                        {
                            typeof params[p] === 'object' ?
                            Object.keys(params[p]).map((obj, idx) => (
                            <div key={idx} className={"ms-2 flex items-center"}>
                                <div className={"font-bold me-2"}>{obj}:</div>
                                <div>{JSON.stringify(params[p][obj])}</div>
                            </div>
                        ))
                        :
                        <div className={""}>{params[p]}</div>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}