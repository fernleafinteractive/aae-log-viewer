import { Dropdown } from "flowbite-react";
import {useState} from "react";

const dropdownTheme = {
    floating: {
        target: "bg-blue-400 enabled:hover:bg-blue-500 focus:ring-0 rounded-md me-2",
    }
}

export default function DropdownFilter({filterOptions, setStatusFilter}) {
    const [selected, setSelected] = useState("Select Filter");

    return (
        <Dropdown theme={dropdownTheme} label={selected} dismissOnClick={true}>
            {filterOptions.map((option, index) => (
                <Dropdown.Item key={index} onClick={() => {
                    setStatusFilter(option.id);
                    setSelected(option.name);
                }}>{option.name}</Dropdown.Item>
            ))}
        </Dropdown>
    );
}