import {useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import taskData from "../../test_data/tasks_graph.json";

function getGraphData(tasks) {
    const output = {
        name: "Root",
        children: []
    }

    const nodes = new Map();

    for(const node of tasks.elements.nodes) {
        nodes.set(node.data.id, node.data);
    }

    let edges = tasks.elements.edges;

    const map = new Map();
    const rootNodes = new Set();

    for(const edge of edges) {
        const parent = edge.data.target;
        const child = edge.data.source;

        if(!map.has(parent)) {
            map.set(parent, {name: "A", children: []});
        }

        if(!map.has(child)) {
            map.set(child, {name: "A", children: []});
        }

        rootNodes.add(parent);
        rootNodes.add(child);
    }

    for(const edge of edges) {
        const parent = edge.data.target;
        const child = edge.data.source;

        const parentNode = map.get(parent);
        const childNode = map.get(child);

        if(parentNode && childNode) {
            parentNode.children.push(childNode);
            rootNodes.delete(child);
        }
    }

    for(const root of rootNodes) {
        output.children.push(map.get(root));
    }

    return output;
}

export default function TaskGraph(props) {

    const svgRef = useRef(null);

    const data = getGraphData(taskData);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        // Clear previous SVG contents
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Set up dimensions
        const width = 5000;
        const height = 20000;
        svg.attr('width', width).attr('height', height);

        // Create a group for all graph elements that will be zoomable
        const g = svg.append('g');

        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])  // Limit zoom levels
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        // Apply zoom to the SVG
        svg.call(zoom);

        // Create hierarchy
        const root = d3.hierarchy(data);

        // Create tree layout
        const treeLayout = d3.tree()
            .separation(function(a, b) { return (a.parent === b.parent ? 1 : 2) / a.depth; })
            .size([height, width - 100]);

        // Apply the tree layout
        const treeData = treeLayout(root);

        // Create links
        const link = g.selectAll('.link')
            .data(treeData.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5)
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x)
            );

        // Create nodes
        const node = g.selectAll('.node')
            .data(treeData.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        // Add circles for nodes
        node.append('circle')
            .attr('r', 5)
            .attr('fill', d => d.children ? '#555' : '#999');

        // Add labels
        node.append('text')
            .attr('dy', 3)
            .attr('x', d => d.children ? -10 : 10)
            .style('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.name);

        treeLayout.size([200, 200]);
        treeLayout(root);

    }, [data]);

    return (
        <div style={{border: "1px solid blue", margin: "100px"}}>
            <svg ref={svgRef}></svg>
        </div>
    )
}