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


    const updateGraph = () => {
        setEdges([])
        setNodes([])
        
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
        /*
            file_to_functions
            {
                file_name: [{ 'function_name', 'function_parameters'}]
            }

        */
        Object.keys(state.file_to_functions).forEach((file_name, index) => {
            const file_key = file_name.slice(0, file_name.lastIndexOf('.'))
            if (!nodeIdSet.has(file_key)) {
                if (window.innerHeight < h + (state.file_to_functions[file_name].size + 1) * 100) {
                    h = 0
                    w += 1
                }
                vec.push({
                    id: file_key,
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
                nodeIdSet.add(file_key)
            }

            Array.from(state.file_to_functions[file_name]).forEach((item, item_index) => {
                const function_key = file_key + '-' + item.function_name
                const nodeId = function_key
                if (!nodeIdSet.has(nodeId)) {
                    vec.push({
                        id: nodeId,
                        data: { label: item.function_name + '(' + item.function_parameters + ')' },
                        position: {
                            x: 25,
                            y: (item_index + 1) * 70
                        },
                        className: 'light',
                        parentId: file_key,
                        style: {
                            width: 400 - 50,
                        }
                    })
                    nodeIdSet.add(nodeId)
                }
            })
        })

        // { id: 'e1-2', source: '1', target: '2', animated: true },
        const tmp = []
        const linkIdSet = new Set([])

        /*
            import_definition
            {
                file_key + '-' + function_name: [
                    file_key called,
                ]
            }

        */
        // console.log(state.import_definition)
        Object.keys(state.import_definition).forEach((function_key, index) => {
            // console.log(function_name)
            if (nodeIdSet.has(function_key)) {
                Array.from(state.import_definition[function_key]).forEach((item, file_index) => {
                    // console.log(file_name)
                    if (nodeIdSet.has(item.file_key_target)) {
                        const linkId = `${function_key}-${item.file_key_target}-import`
                        if (!linkIdSet.has(linkId)) {
                            tmp.push({
                                id: linkId,
                                source: function_key,
                                target: item.file_key_target,
                                animated: false,
                            })
                            linkIdSet.add(linkId)
                        }
                    }
                })

            }
        })


        /*
            function_links
            {
                file_name + '-' + function_name: [
                    file_name + '-' + function_name,
                    file_name + '-' + function_name,
                ]
            }

        */
        Object.keys(state.function_links).forEach((function_target) => {

            // console.log(function_target)
            if (nodeIdSet.has(function_target)) {
                Array.from(state.function_links[function_target]).forEach((function_source, function_index) => {
                    // console.log(function_source)
                    if (nodeIdSet.has(function_source)) {
                        const linkId = `${function_source}-${function_target}-function-link`
                        if (!linkIdSet.has(linkId)) {
                            tmp.push({
                                id: linkId,
                                source: function_source,
                                target: function_target,
                                animated: true,
                            })
                            linkIdSet.add(linkId)

                            // console.log(linkId)
                        }
                    }
                })
            }


        })
        // console.log(tmp)

        setNodes(vec)
        setEdges(tmp)
    }

    useEffect(() => {
        if (state.rerenderGraph) {

            updateGraph()

            dispatch({
                'value': {
                    'rerenderGraph': false,
                }
            })
        }
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
