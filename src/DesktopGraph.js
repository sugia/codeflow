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
import './DesktopGraph.css'

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

            Array.from(state.file_to_functions[file_name]).forEach((function_name, function_index) => {
                vec.push({
                    id: function_name,
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
            })
        })

        // console.log(vec)
        setNodes(vec)
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
