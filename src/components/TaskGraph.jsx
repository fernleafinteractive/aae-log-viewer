import {useRef, useEffect, useState} from "react";
import taskData from "../../test_data/tasks_graph.json";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

cytoscape.use(dagre);

export default function TaskGraph(props) {

    const [selectedNode, setSelectedNode] = useState(null);
    const cyRef = useRef(null);

    useEffect(() => {
        const cy = cytoscape({
            elements: taskData.elements,
            container: cyRef.current,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(id)',
                        'background-color': function(element) {
                            return element.outgoers().edges().length > 0 ? '#2e80c7' : '#2ec770';
                        },
                        'color': '#000000',
                        'width': '100px',
                        'shape': 'rectangle',
                        'text-valignment': 'center',
                        'text-halignment': 'center'
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


        cy.on('tap', 'node', (event) => {
            const node = event.target;
            setSelectedNode({
                data: node._private.data
            });
            // TODO: apply a color when selected
        });
    }, []);

    return (
        <div style={{position: 'relative'}}>
            <div ref={cyRef} style={{width: '100%', height: "85vh", border: "2px solid #e5e7eb", borderRadius: "0.5rem"}}></div>
            <div style={{display: selectedNode ? 'block' : 'none', position: 'absolute', bottom: 0, left: 0, backgroundColor: '#e5e7eb', margin: "1rem", padding: "1rem", borderRadius: "0.5rem"}}>
                {
                    selectedNode ?
                        <div>
                            {Object.keys(selectedNode).map((k, index) => (
                                <div>
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
    )
}