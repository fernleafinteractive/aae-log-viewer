export default function InputFilter({setMessageFilter}) {

    function handleSubmit(e) {
        e.preventDefault();
        setMessageFilter(e.target.input_filter.value);
    }

    return (
        <form onSubmit={handleSubmit} className={"ms-4"}>
            <div>
                <input onChange={(e) => setMessageFilter(e.target.value)} type="text" id="text-filter" name={"input_filter"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Filter by text" required />
            </div>
        </form>
    )
}