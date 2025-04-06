// import ForceGraph3D from "react-force-graph-3d";
// import React, { useEffect, useRef, useCallback } from "react";
//
// const MyGraph = ({jsonData}) => {
//     const fgRef = useRef();
//     const [focusNode, setFocusNode] = React.useState(null);
//     const [data, setData] = React.useState(null);
//
//     useEffect(() => {
//         fetch('/datasets/miserables.json')
//             .then(res => res.json())
//             .then(json => {
//                 setData(json);
//                 const focus = json.nodes.find(n => n.id === "Valjean");
//
//                 const timer = setTimeout(() => {
//                     const distance = 50;
//                     const distRatio = 1 + distance / Math.hypot(focus.x, focus.y, focus.z);
//                     fgRef.current.cameraPosition(
//                         { x: focus.x * distRatio, y: focus.y * distRatio, z: focus.z * distRatio },
//                         focus,
//                         3000
//                     );
//                 }, 2000);
//                 setFocusNode(focus);
//
//                 return () => clearTimeout(timer);
//             });
//
//     }, []);
//
//     const handleClick = useCallback(node => {
//         if (node !== focusNode) {
//             console.log("Clicked on " + node.id)
//             const distance = 40;
//             const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
//
//             fgRef.current.cameraPosition(
//                 { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
//                 node,
//                 3000
//             );
//             setFocusNode(node)
//         }
//     }, [focusNode]);
//
//     if (!data) return <div>Loading graph...</div>;
//
//     return (
//         <ForceGraph3D
//             ref={fgRef}
//             graphData={data}
//             nodeLabel="id"
//             linkLabel="value"
//             nodeAutoColorBy="group"
//             linkAutoColorBy="value"
//             onNodeClick={handleClick}
//             backgroundColor="#f0f0f0"
//             linkWidth={0.5}
//             linkOpacity={0.7}
//
//             linkDirectionalArrowLength={3.5}
//             linkDirectionalArrowRelPos={1}
//             width={1500}
//             height={800}
//             // linkCurvature={0.25}
//         />
//     );
// };
//
// export default MyGraph;

import ForceGraph3D from "react-force-graph-3d";
import React, { useEffect, useRef, useCallback } from "react";

const MyGraph = ({ jsonData, targetNode, setNodeFromGraph }) => {
    const fgRef = useRef();
    const [focusNode, setFocusNode] = React.useState(null);
    const [data, setData] = React.useState(null);

    useEffect(() => {
        // If jsonData changes, set the new data
        setData(jsonData);

        if (jsonData && jsonData.nodes) {
            const focus = jsonData.nodes.find(n => n.id === targetNode);

            const timer = setTimeout(() => {
                const distance = 50;
                const distRatio = 1 + distance / Math.hypot(focus.x, focus.y, focus.z);
                fgRef.current.cameraPosition(
                    { x: focus.x * distRatio, y: focus.y * distRatio, z: focus.z * distRatio },
                    focus,
                    3000
                );
            }, 2000);
            setFocusNode(focus);

            return () => clearTimeout(timer);
        }
    }, [jsonData]); // Re-run effect when jsonData changes

    const handleClick = useCallback(node => {
        if (node !== focusNode) {
            console.log("Clicked on " + node.id);
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node,
                3000
            );
            setFocusNode(node);
            setNodeFromGraph(node.id);
            targetNode = node;
        }
    }, [focusNode]);

    if (!data) return <div>Loading graph...</div>;

    return (
        <ForceGraph3D
            ref={fgRef}
            graphData={data}
            nodeLabel="id"
            linkLabel="value"
            nodeAutoColorBy="group"
            linkAutoColorBy="value"
            onNodeClick={handleClick}
            backgroundColor="#f5faff"
            linkWidth={0.5}
            linkOpacity={0.7}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            width={1500}
            height={800}
        />
    );
};

export default MyGraph;
