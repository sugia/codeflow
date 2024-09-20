import {
    useState,
    useEffect,
    useCallback,
    useReducer,
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
    initialState,
} from './store/Context'

import {
    reducer,
} from './store/reducer'

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
import './Desktop.css'

const languageMap = {
    '.py': 'Python',
    '.cpp': 'C++',
    '.java': 'Java',
    '.c': 'C',
    '.cs': 'C#',

    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',

    '.go': 'Golang',
    '.php': 'PHP',

    '.rb': 'Ruby',
    '.rs': 'Rust',

    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.kts': 'Kotlin scripts',

    '.lua': 'Lua',
    '.dart': 'Dart',
    '.scala': 'Scala',

    '.pl': 'Perl',
    '.pm': 'Perl Modules',

    '.erl': 'Erlang',
    '.hrl': 'Erlang Header File',

    '.html': 'HTML',
    '.css': 'CSS',
    '.json': 'JSON',
    '.md': 'Markdown',
    // Add more extensions and languages as needed
}

const detectLanguageByExtension = (fileName) => {
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    return languageMap[extension] || 'Static File';
}


const importRegex = /import\s+(?:(?<default>\w+)\s*,?\s*)?(?:\{(?<named>[\w\s,]*)\}\s*,?\s*)?(?:\*\s+as\s+(?<namespace>\w+)\s*,?\s*)?from\s+['"`](?<module>.+?)['"`];?/g;

const extractImportElements = (file_name, code) => {
    const matches = {};
    let match;

    // function_name: 
    while ((match = importRegex.exec(code)) !== null) {
        if (match.groups.namespace) {
            matches[match.groups.namespace] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
        }

        if (match.groups.named) {
            match.groups.named.split(',').map(i => i.trim()).filter(Boolean).forEach((item) => {
                matches[item] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
            })
        }
    }

    return matches;
}


// Combine the regex for function declarations, function expressions, and arrow functions
const combinedFunctionRegex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g;

const extractAllFunctions = (file_name, code, regex) => {
    const matches = {};
    let match;

    while ((match = regex.exec(code)) !== null) {
        if (match[2]) {
            // Function Declaration
            matches[match[2]] = { 'file_name': file_name, 'function_parameters': match[3] }
            // matches.push({ type: file_name, name: match[2], params: match[3] });
        } else if (match[5]) {
            // Function Expression
            matches[match[5]] = { 'file_name': file_name, 'function_parameters': match[6] }
            // matches.push({ type: file_name, name: match[5], params: match[6] });
        } else if (match[8]) {
            // Arrow Function
            matches[match[8]] = { 'file_name': file_name, 'function_parameters': match[9] }
            // matches.push({ type: file_name, name: match[8], params: match[9] });
        }
    }

    return matches;
}





const Desktop = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const [nodes, setNodes, onNodesChange] = useNodesState(state.initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(state.initialEdges)

    const onConnect = useCallback((connection) => {
        setEdges((eds) => addEdge(connection, eds))
    }, [])


    const test = (a, b, c, d, e, f, g) => {
        //
    }

    // file_name: programming_language
    let file_definition = {}

    let import_definition = {}
    // function_name: file_name, function_parameters
    // function_start_row, function_start_column,
    // function_end_row, function_end_column,
    let function_definition = {}


    let file_to_functions = {}

    const updateFileToFunctions = () => {
        for (let function_name in function_definition) {
            if (function_definition[function_name]['file_name'] in file_to_functions) {
                file_to_functions[function_definition[function_name]['file_name']].add(function_name)
            } else {
                file_to_functions[function_definition[function_name]['file_name']] = new Set([function_name])
            }
        }
        console.log('file_to_functions', file_to_functions)
    }

    return (
        <>
            <Row justify='center' align='middle' style={{ 'height': '80vh' }}>
                <Upload.Dragger directory={true} multiple={true} showUploadList={false} onChange={(info) => {
                    // console.log(info.file.originFileObj)
                    const file = info.file.originFileObj



                    // console.log(file.name)
                    const reader = new FileReader()

                    reader.onload = (e) => {

                        file_definition[file.name] = detectLanguageByExtension(file.name)

                        // console.log(file.name)

                        import_definition = {
                            ...import_definition,
                            ...extractImportElements(file.name, e.target.result),
                        }

                        function_definition = {
                            ...function_definition,
                            ...extractAllFunctions(file.name, e.target.result, combinedFunctionRegex),
                        }


                        console.log('file_definition', file_definition)
                        console.log('import_definition', import_definition)
                        console.log('function_definition', function_definition)
                        updateFileToFunctions()
                    }

                    reader.readAsText(file)
                }}>
                    <div style={{ 'width': '400px' }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag folder or file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Easily upload your PDF by clicking to select files from your device or dragging a PDF file and dropping into the box here.
                        </p>
                    </div>
                </Upload.Dragger>
            </Row>

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
        </>
    );
};

export default Desktop;
