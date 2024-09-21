import {
    useState,
    useEffect,
    useCallback,
    useContext,
} from 'react';

import {
    Upload,
    Row,
    Col as Column,
} from 'antd'

import * as antd_all_functions from 'antd'

import {
    InboxOutlined,
} from '@ant-design/icons'

import {
    Context,
} from './store/Context'


import {
    ReactFlow,
    addEdge,
    Background,
    useNodesState,
    useEdgesState,
    MiniMap,
    Controls,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import './DesktopGraphFlow.css'

function DesktopGraph() {
    const { state, dispatch } = useContext(Context)

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const onConnect = useCallback((connection) => {
        setEdges((eds) => addEdge(connection, eds))
    }, [])


    const updateNodes = () => {
        const vec = []
        /*
        id: '2',
        data: { label: 'Group A' },
        position: { x: 100, y: 100 },
        className: 'light',
        style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
        */
        let h = 0
        let w = 0

        const nodeIdSet = new Set([])
        Object.keys(state.file_to_functions).forEach((file_name, index) => {
            if (window.innerHeight < h + (state.file_to_functions[file_name].size + 1) * 100) {
                h = 0
                w += 1
            }
            vec.push({
                id: file_name,
                data: { label: file_name },
                position: {
                    x: 500 * w,
                    y: h,
                },
                className: 'light',
                style: {
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    width: 400,
                    height: (state.file_to_functions[file_name].size + 1) * 70,
                }
            })
            h += (state.file_to_functions[file_name].size + 1) * 100
            nodeIdSet.add(file_name)

            Array.from(state.file_to_functions[file_name]).forEach((function_name, function_index) => {
                vec.push({
                    id: function_name.slice(0, function_name.lastIndexOf('(')),
                    data: { label: function_name },
                    position: {
                        x: 25,
                        y: (function_index + 1) * 70
                    },
                    className: 'light',
                    parentId: file_name,
                    style: {
                        width: 400 - 50,
                    }
                })
                nodeIdSet.add(function_name.slice(0, function_name.lastIndexOf('(')))
            })
        })

        // { id: 'e1-2', source: '1', target: '2', animated: true },
        const tmp = []
        
        Object.keys(state.import_definition).forEach((function_name, index) => {
            if (nodeIdSet.has(function_name)) {
                tmp.push({
                    id: `${function_name}-${state.import_definition[function_name]['function_called_in']}`,
                    source: function_name,
                    target: state.import_definition[function_name]['function_called_in'],
                    animated: false,
                })
            }
        })
        
        
        // console.log(state.function_links)
        // console.log(nodeIdSet)
        state.function_links.forEach((item) => {
            // console.log(item)
            if (nodeIdSet.has(item['source']) && nodeIdSet.has(item['target'])) {
                
                tmp.push({
                    id: `${item['source']}-${item['target']}-link`,
                    source: item['source'],
                    target: item['target'],
                    animated: true,
                })
            }
        })
        // console.log(vec)
        setNodes(vec)
        setEdges(tmp)
    }

    useEffect(() => {
        updateNodes()

        dispatch({
            'value': {
                'rerenderGraph': false,
            }
        })
    }, [state.rerenderGraph])

    return (

        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <MiniMap />
            <Controls />
            <Background />
        </ReactFlow>


    )
}

export default DesktopGraph
