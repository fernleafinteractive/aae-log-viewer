export default function InputFilter({setMessageFilter}) {

    function handleSubmit(e) {
        e.preventDefault();
        setMessageFilter(e.target.input_filter.value);
    }

    return (
        <form onSubmit={handleSubmit} className={"ms-4"}>
            <div>
                <input onChange={(e) => setMessageFilter(e.target.value)} type="text" id="text-filter" name={"input_filter"} className="bg-[#3A3E47] border border-[#3A3E47] text-[#b0b3b7] text-sm rounded-[0.25rem] focus:ring-[#3A3E47] focus:border-[#3A3E47] block w-full p-2.5" placeholder="Filter by text" required />
            </div>
        </form>
    )
}