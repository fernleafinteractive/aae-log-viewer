import {useRef, useEffect, useState, useCallback, useContext} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import UploadIcon from "./UploadIcon.jsx";
import {didTaskFail, isTaskRunning, getTaskExecutionTime} from "../utils/task_utils.js";
import {LogDataMappingContext} from "../context/LogDataMappingContext.jsx";

cytoscape.use(dagre);

export default function TaskGraph(props) {

    const logMappingContext = useContext(LogDataMappingContext);
    const [data, setData] = useState(null);

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
            setData(event.data);
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
                        'color': '#000000',
                        'width': '100px',
                        'shape': 'round-rectangle',
                        'border-width': '4px',
                        'border-color': function(element) {
                            return element.outgoers().edges().length === 0 ? '#7a06b0' : 'rgba(119,119,119,0)';
                        }
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#939393',
                        'target-arrow-color': '#939393',
                        // 'target-arrow-shape': 'triangle',
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

            if(selectedNodeRef.current !== null) {
                if(selectedNodeRef.current.data.id === node._private.data.id) {
                    node.style('background-color', selectedNodeRef.current.backgroundColor);
                    selectedNodeRef.current = null;
                    setSelectedNode(null);
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

        if(logMappingContext.data.mapping.length > 0) {
            for(const task of logMappingContext.data.mapping) {

                const node = cy.nodes().find((el) => {
                    return el.data('id') === task.key;
                });

                if(!node) continue;

                if(isTaskRunning(task.value)) {
                    node.style('background-color', '#3180c0');
                } else {
                    if(didTaskFail(task.value)) {
                        node.style('background-color', '#c03136');
                    } else {
                        node.style('background-color', '#2ebd60');
                    }
                }
            }
        }

    }, [data, logMappingContext.data]);

    useEffect(() => {

        if(cyRef.current === null) return;

        if(inputField.length < 6) return;

        const nodes = cyRef.current.nodes().filter((el) => {
            return el.data('id').includes(inputField);
        });

        cyRef.current.fit(nodes);

    }, [inputField]);

    return (
        <div>
            <div className={"flex items-center my-4 py-4"}>
                <input type={"text"} className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} value={inputField} onChange={(e) => setInputField(e.target.value)} placeholder={"Search by task ID"}
                />
                <label
                    className="ms-auto text-white font-semibold px-3 py-2 rounded-md bg-gray-500 hover:bg-gray-600 hover:cursor-pointer ring-1 ring-gray-500 focus-within:ring-2 focus-within:ring-indigo-500"
                    aria-label={"Upload log file"}>
                    <UploadIcon/>
                    <input type="file" className="focus:outline-none hidden" onChange={fileSelect} multiple={true}/>
                </label>
            </div>

            <div style={{position: 'relative'}}>
                <div ref={cyContainerRef}
                     style={{width: '100%', height: "85vh", border: "2px solid #e5e7eb", borderRadius: "0.5rem"}}></div>
                <div style={{
                    display: selectedNode !== null ? 'block' : 'none',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#e5e7eb',
                    margin: "1rem",
                    padding: "1rem",
                    borderRadius: "0.5rem"
                }}>
                    {
                        selectedNode !== null ?
                            <div>
                                {Object.keys(selectedNode).map((k, index) => (
                                    <div key={index}>
                                        {
                                            typeof selectedNode[k] === 'object' ?
                                                Object.keys(selectedNode[k]).map((obj, idx) => (
                                                    <div key={idx} className={"ms-2 flex items-center"}>
                                                        <div className={"font-bold me-2"}>{obj}:</div>
                                                        <div>{JSON.stringify(selectedNode[k][obj])}</div>
                                                    </div>
                                                ))
                                                :
                                                <div className={""}>{selectedNode[k]}</div>
                                        }
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