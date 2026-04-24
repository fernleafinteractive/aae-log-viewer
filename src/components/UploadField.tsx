import UploadIcon from "./icons/UploadIcon.jsx";

export default function UploadField({label, fileSelect} : {label : string, fileSelect : (e: any) => Promise<any>}) {
    return (
        <label className="flex items-center p-2 text-white rounded-[0.25rem] bg-[#398FFE] cursor-pointer">
            <UploadIcon className={"size-6 me-2"}/>
            {label}<input type="file" className="focus:outline-none hidden" onChange={fileSelect} multiple={true}/>
        </label>
    )
}
