import InputField from "./InputField";

export default function InputFilter({messageFilter, setMessageFilter}) {

    function handleSubmit(e) {
        e.preventDefault();
        setMessageFilter(e.target.input_filter.value);
    }

    return (
        <form onSubmit={handleSubmit} className={"ms-4"}>
            <div>
                <InputField changeCallback={setMessageFilter} value={messageFilter} placeholder={"Filter by text"} />
            </div>
        </form>
    )
}