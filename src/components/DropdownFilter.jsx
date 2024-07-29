import { Dropdown } from "flowbite-react";
import {useState} from "react";

const dropdownTheme = {
    floating: {
        target: "bg-blue-400 enabled:hover:bg-blue-500 focus:ring-blue-400 rounded-md",
    }
}

export function DropdownFilter({setStatusFilter}) {
    const [selected, setSelected] = useState("All");
    const updateSelected = (value) => {
        switch(value) {
            case 'Task Status': {
                setStatusFilter("TASK_STATUS");
                break;
            }
            case 'Debug': {
                setStatusFilter("DEBUG");
                break;
            }
            case 'Error': {
                setStatusFilter("ERROR");
                break;
            }
            default: {
                setStatusFilter("");
                break;
            }
        }

        setSelected(value);
    }
    return (
        <Dropdown className={"border-"} theme={dropdownTheme} label={selected} dismissOnClick={true}>
            <Dropdown.Item onClick={() => updateSelected("All")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => updateSelected("Task Status")}>Task Status</Dropdown.Item>
            <Dropdown.Item onClick={() => updateSelected("Debug")}>Debug</Dropdown.Item>
            <Dropdown.Item onClick={() => updateSelected("Error")}>Error</Dropdown.Item>
        </Dropdown>
    );
}