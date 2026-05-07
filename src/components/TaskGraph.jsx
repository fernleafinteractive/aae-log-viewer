import {useRef, useEffect, useState, useCallback, useContext} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import {didTaskFail, isTaskRunning, getTaskExecutionTime} from "../utils/task_utils.js";
import {useLogDataMapping} from "../context/LogDataMappingContext";
import {useSelectedTaskID} from "../context/SelectedTaskIDContext";
import {useTaskGraph} from "../context/TaskGraphContext";
import UploadField from "./UploadField";
import InputField from "./InputField";
import {Timing} from "./TaskTimings";
import CopyIcon from "./icons/CopyIcon.jsx";
import {useView} from "../context/ViewContext";


cytoscape.use(dagre);

export default function TaskGraph(props) {

    const {mapping, totalExecutionTime, setMapping} = useLogDataMapping();
    const {data, setTaskGraph} = useTaskGraph();
    const {taskID: selectedTaskID, setTaskID: setSelectedTaskID} = useSelectedTaskID();
    const {view, setView} = useView();

    const [worker, setWorker] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [inputField, setInputField] = useState("");

    const cyRef = useRef(null);
    const cyContainerRef = useRef(null);
    const selectedNodeRef = useRef(null);

    const fileSelect = useCallback(async (e) => {
        if(worker === null) {
            console.error("worker is not setup");
            return;
        }

        e.preventDefault();
        if(e.target.files.length === 0) return;

        worker.postMessage(e.target.files);

    }, [worker]);

    useEffect(() => {

        const myWorker = new Worker(new URL(".././workers/task_graph_worker.js", import.meta.url));

        myWorker.onmessage = (event) => {
            const graphData = event.data;

            if(!graphData) return;
            if(typeof graphData !== "object") return;

            const keys = Object.keys(graphData);
            if(keys.length === 0) return;

            if(keys[0] !== "elements") return;

            setTaskGraph(event.data);
        }

        setWorker(myWorker);

        return () => {
            myWorker.terminate();
        }

    }, []);

    useEffect(() => {

        if(data === null) return;

        const cy = cytoscape({
            elements: data.elements,
            container: cyContainerRef.current,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(id)',
                        'background-color': '#ef7d2c',
                        'color': '#b0b3b7',
                        'width': '100px',
                        'shape': 'round-rectangle',
                        'border-width': '2px',
                        'border-color': function(element) {
                            return element.outgoers().edges().length === 0 ? '#7a06b0' : 'rgba(119,119,119,0)';
                        }
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#5e6062',
                        'target-arrow-shape': 'none',
                        'source-arrow-color': '#5e6062',
                        'source-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                }
            ],
            layout: {
                name: 'dagre',
                // Dagre-specific options
                rankDir: 'BT', // Top to Bottom direction
                nodeSep: 150, // Separation between nodes
                rankSep: 150, // Separation between ranks (levels)
                spacingFactor: 1,
                edgeLengthFn: () => 1, // Optional edge length function
            }
        });

        cyRef.current = cy;
        cy.on('tap', 'node', (event) => {
            const node = event.target;
            const taskList = [node._private.data.id];

            for(const n of node.successors()) {
                const id = n.data("id");
                if(id.includes("-")) continue;
                taskList.push(id);
            }

            if(selectedNodeRef.current !== null) {
                if(selectedNodeRef.current.data.id === node._private.data.id) {
                    node.style('background-color', selectedNodeRef.current.backgroundColor);
                    selectedNodeRef.current = null;
                    setSelectedNode(null);
                    setSelectedNode("");
                    return;
                }

                const currentNode = cy.nodes().find((el) => {
                    return el.data('id') === selectedNodeRef.current.data.id;
                });

                if(currentNode) {
                    currentNode.style('background-color', selectedNodeRef.current.backgroundColor);
                }
            }

            setSelectedNode(node._private.data);
            selectedNodeRef.current = {
                data: node._private.data,
                backgroundColor: node.style('background-color')
            };
            node.style('background-color', '#d6c529');
        });

        if(mapping.size > 0) {

            const mappingKeys = [...mapping.keys()];

            for(const key of mappingKeys) {
                const task = mapping.get(key);

                const node = cy.nodes().find((el) => {
                    return el.data('id') === key;
                });

                if(!node) continue;

                if(isTaskRunning(task)) {
                    node.style('background-color', '#3180c0');
                } else {
                    if(didTaskFail(task)) {
                        node.style('background-color', '#c03136');
                    } else {
                        node.style('background-color', '#2ebd60');
                    }
                }
            }
        }

    }, [data, mapping]);

    useEffect(() => {

        if(cyRef.current === null) return;

        if(inputField.length < 6) return;

        const nodes = cyRef.current.nodes().filter((el) => {
            return el.data('id').includes(inputField);
        });

        cyRef.current.fit(nodes);

    }, [inputField]);

    const handleFitGraph = (e) => {
        if(cyRef.current === null) return;

        cyRef.current.fit();
    }

    return (
        <div className={"flex flex-col grow p-4 bg-[#272B34] rounded-[0.25rem]"}>
            <div className={"flex items-center pb-4"}>

                <div>
                    <InputField changeCallback={setInputField} value={inputField} placeholder={"Search by task ID"} />
                </div>

                <div>
                    <button className={"p-2 text-white rounded-[0.25rem] bg-[#ac39fe] cursor-pointer ms-2"} onClick={handleFitGraph}>Fit Graph</button>
                </div>

                <div className={"ms-auto"}>
                    <UploadField label={"Upload Task Graph"} fileSelect={fileSelect} />
                </div>
            </div>

            <div className={"flex grow"} style={{position: 'relative'}}>
                <div ref={cyContainerRef}
                     style={{display: 'flex', flexGrow: '1', border: "2px solid #3A3E47", borderRadius: "0.25rem", backgroundColor: "#3A3E47"}}></div>

                <div style={{
                    display: selectedNode !== null ? 'block' : 'none',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#272B34',
                    margin: "1rem",
                    padding: "1rem",
                    borderRadius: "0.25rem",
                    maxHeight: "15rem",
                    overflowY: "auto"
                }}>
                    {
                        selectedNode !== null ?
                            <div className={"max-w-2xl"}>

                                <div className={"pb-2 mb-2 border-b-[2px] border-[#363A45]"}>
                                    <div className={"flex mb-2"}>
                                        <button
                                            className={"p-[0.25rem] text-[0.85rem] text-white rounded-[0.25rem] bg-[#7cb8d9] cursor-pointer"}
                                            onClick={() => {
                                                navigator.clipboard.writeText(JSON.stringify(selectedNode));
                                            }}>Copy JSON
                                        </button>
                                        <button
                                            className={"ms-2 p-[0.25rem] text-[0.85rem] text-white rounded-[0.25rem] bg-[#7c7ed9] cursor-pointer"}
                                            onClick={() => {
                                                setSelectedTaskID(selectedNode.id);
                                                setView("LOGS");
                                            }}>View Logs
                                        </button>
                                        <button
                                            className={"ms-auto p-[0.25rem] text-[0.85rem] text-white rounded-[0.25rem] bg-[#db7f7f] cursor-pointer"}
                                            onClick={() => {
                                                setSelectedNode(null);
                                                setSelectedTaskID("");
                                            }}>Close
                                        </button>
                                    </div>
                                    <div className={"flex items-center"}>Task ID: <span
                                        className={"text-white ms-2"}>{selectedNode.id}</span> <CopyIcon
                                        onClick={() => navigator.clipboard.writeText(selectedNode.id)}
                                        className={"size-5 ms-5 hover:cursor-pointer"} style={{fill: "#b0b3b7"}} title={"Copy Task ID to clipboard"} /></div>
                                </div>

                                {Object.keys(selectedNode).filter(k => k !== "id").map((k, index) => (
                                    <div key={index}>
                                        <div className={"pb-2"}>
                                            <div className={"text-white"}>{k}:</div>
                                            {
                                                typeof selectedNode[k] === 'object' ?
                                                    Object.keys(selectedNode[k]).map((obj, idx) => (
                                                        <div key={idx} className={"ps-2 flex items-center"}>
                                                            <div className={"me-2"}>{obj}:</div>
                                                            <div>{JSON.stringify(selectedNode[k][obj])}</div>
                                                        </div>
                                                    ))
                                                    :
                                                    <div className={"ps-2"}>{selectedNode[k]}</div>
                                            }
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>
        </div>
    )
}