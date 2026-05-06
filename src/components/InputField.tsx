export default function InputField({changeCallback, value, placeholder}) {
    return (
        <input value={value ?? ""} onChange={(e) => changeCallback(e.target.value)} type="text" id="text-filter" name={"input_filter"}
               className="bg-[#3A3E47] border border-[#3A3E47] text-[#b0b3b7] text-sm rounded-[0.25rem] focus:ring-[#3A3E47] focus:border-[#3A3E47] block w-full p-2.5"
               placeholder={placeholder}/>
    )
}