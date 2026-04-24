import { Dropdown } from "flowbite-react";
import {useState} from "react";

const dropdownTheme = {
    floating: {
        target: "bg-[#398FFE] enabled:hover:bg-blue-500 focus:ring-0 rounded-[0.25rem] me-2",
        content: 'bg-[#363A45]',
        item: {
            base: 'flex w-full item-center bg-[#363A45] text-[#b0b3b7] px-2 py-1 hover:bg-blue-500 hover:text-white',
        }
    }
}

export default function DropdownFilter({filterOptions, setStatusFilter}) {
    const [selected, setSelected] = useState("Select Filter");

    return (
        <Dropdown theme={dropdownTheme} label={selected} dismissOnClick={true}  className={"bg-[#363A45]"}>
            {filterOptions.map((option, index) => (
                <Dropdown.Item key={index} onClick={() => {
                    setStatusFilter(option.id);
                    setSelected(option.name);
                }}>{option.name}</Dropdown.Item>
            ))}
        </Dropdown>
    );
}