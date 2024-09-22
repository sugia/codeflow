import {
    useState,
    useEffect,
    useCallback,
    useContext,
} from 'react';

import {
    Upload,
    Row,
    Col,
    Layout,
    Affix,
    Image,
    Typography,
    Space,
    Popover,
    Button,
} from 'antd'

import * as antd_all_functions from 'antd'

import {
    InboxOutlined,
    FolderOpenOutlined,
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

import DesktopHeader from './DesktopHeader'
import DesktopGraphFlow from './DesktopGraphFlow'

import {
    languageMap,
} from './store/utils'


const getFileExtension = (fileName) => {
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    return extension || 'Static File'
}

const DesktopGraph = () => {
    const { state, dispatch } = useContext(Context)

    const test = (a, b, c, d, e, f, g) => {
        //
    }

    let file_definition = {}
    let import_definition = {}
    let function_definition = {}
    let file_to_functions = {}
    let function_links = []
    let renderGraph = undefined


    const loadFolder = (info) => {
        if (renderGraph) {
            clearTimeout(renderGraph)

            dispatch({
                'value': {
                    'status': 'loading',
                }
            })
        }

        const file = info.file.originFileObj

        const reader = new FileReader()

        reader.onload = (e) => {
            const fileExtension = getFileExtension(file.name)
            if (!(fileExtension in languageMap)) {
                return
            }


            import_definition = {
                ...import_definition,
                ...languageMap[fileExtension].getImportDefinition(file.name, e.target.result),
            }
            function_definition = {
                ...function_definition,
                ...languageMap[fileExtension].getFunctionDefinition(file.name, e.target.result),
            }
            file_to_functions = {
                ...file_to_functions,
                ...languageMap[fileExtension].getFileToFunctions(file.name, e.target.result),
            }
            function_links = [
                ...function_links,
                ...languageMap[fileExtension].getFunctionLinks(e.target.result),
            ]
            renderGraph = setTimeout(() => {
                dispatch({
                    'value': {
                        'file_definition': file_definition,
                        'import_definition': import_definition,
                        'function_definition': function_definition,
                        'file_to_functions': file_to_functions,
                        'function_links': function_links,
                        'rerenderGraph': true,
                        'status': 'completed',
                    }
                })
            }, 500)
            
        }

        reader.readAsText(file)
    }

    return (
        <>
            <Affix offsetTop={0} style={{ 'position': 'absolute', 'width': '100vw', 'zIndex': 1 }}>
                <Layout.Header style={{ 'background': 'white', 'height': '70px' }}>
                    <Row justify='center' align='top' style={{ 'backgroundColor': 'white', 'height': '100%' }}>
                        <Row justify='space-between' align='top' style={{ 'maxWidth': '2000px', 'width': '100%', 'height': '100%', 'backgroundColor': 'white' }}>
                            <Col style={{ 'cursor': 'pointer' }} onClick={() => { window.scrollTo(0, 0) }}>
                                <Row justify='center' align='bottom'>
                                    <Col>
                                        <Image height={30} preview={false} src={state.appLogo}></Image>
                                    </Col>
                                    <Col>
                                        <Typography.Title level={3} style={{ 'color': 'black', 'marginLeft': '10px' }}>{state.appName}</Typography.Title>
                                    </Col>
                                </Row>
                            </Col>


                            <Col span={4}>
                                <Row justify='center'>
                                    <Space.Compact>
                                        <Popover content={<Typography>Open Folder</Typography>}>
                                            <Upload method='get' directory={true} multiple={true} showUploadList={false} onChange={(info) => {
                                                loadFolder(info)
                                            }}>
                                                <Button style={{ 'marginTop': '25px' }} shape='round'
                                                    onClick={() => {
                                                        file_definition = {}
                                                        import_definition = {}
                                                        function_definition = {}
                                                        file_to_functions = {}
                                                        function_links = []
                                                    }}
                                                    icon={
                                                        <FolderOpenOutlined style={{ 'color': 'gray' }} />
                                                    }
                                                >
                                                </Button>
                                            </Upload>
                                        </Popover>


                                    </Space.Compact>
                                </Row>
                            </Col>
                        </Row>
                    </Row>
                </Layout.Header>
            </Affix>
            {
                Object.keys(state.file_to_functions).length === 0 ?

                    <Row justify='center' align='middle' style={{ 'height': '80vh' }}>
                        <Upload.Dragger method='get' directory={true} multiple={true} showUploadList={false} onChange={(info) => {

                            loadFolder(info)
                        }}>
                            <div style={{ 'width': '400px' }}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag folder to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Easily upload your code directory by clicking to select folders from your device or dragging a folder and dropping into the box here.
                                </p>
                            </div>
                        </Upload.Dragger>
                    </Row>
                    :
                    state.status === 'loading' ?
                        <></>
                        :
                        <DesktopGraphFlow />
            }

        </>
    );
};

export default DesktopGraph
