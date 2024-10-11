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
    FileTextOutlined,
    FileSearchOutlined,
    FileProtectOutlined,
    DownloadOutlined,
    ApartmentOutlined,
    DeploymentUnitOutlined,
    ForkOutlined,
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


    const [importDefinition, setImportDefinition] = useState({})
    // const [functionDefinition, setFunctionDefinition] = useState({})
    const [fileToFunctions, setFileToFunctions] = useState({})
    const [functionLinks, setFunctionLinks] = useState([])


    const loadFolder = (info) => {

        const file = info.file.originFileObj

        const reader = new FileReader()

        reader.onload = (e) => {
            const fileExtension = getFileExtension(file.name)
            // console.log(fileExtension)
            if (!(fileExtension in languageMap)) {
                return
            }

            setImportDefinition(
                tmp => {
                    return {
                        ...tmp,
                        ...(languageMap[fileExtension]?.getImportDefinition(file.name, e.target.result) || {}),
                    }
                }
            )

            setFileToFunctions(
                tmp => {
                    return {
                        ...tmp,
                        ...(languageMap[fileExtension]?.getFileToFunctions(file.name, e.target.result) || {}),
                    }
                }
            )

            setFunctionLinks(
                tmp => {
                    return {
                        ...tmp,
                        ...(languageMap[fileExtension]?.getFunctionLinks(file.name, e.target.result) || {}),
                    }
                }
            )

            dispatch({
                'value': {
                    'import_definition': importDefinition,
                    'file_to_functions': fileToFunctions,
                    'function_links': functionLinks,
                    'isUpdatingGraph': true,
                    'isGraphVisible': true,
                }
            })

            /*
            console.log('importDefinition', importDefinition)
            console.log('fileToFunctions', fileToFunctions)
            console.log('functionLinks', functionLinks)
            */

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
                                        <Popover content={<Typography>Open File</Typography>}>
                                            <Upload
                                                method='get'
                                                directory={false}
                                                multiple={true}
                                                showUploadList={false}
                                                onChange={(info) => {
                                                    loadFolder(info)
                                                }}>
                                                <Button style={{ 'marginTop': '25px' }} shape='round'
                                                    onClick={() => {
                                                        setImportDefinition({})
                                                        setFileToFunctions({})
                                                        setFunctionLinks([])
                                                    }}
                                                    icon={
                                                        <FileSearchOutlined style={{ 'color': 'gray' }} />
                                                    }
                                                >
                                                </Button>
                                            </Upload>
                                        </Popover>

                                        <Popover content={<Typography>Open Folder</Typography>}>
                                            <Upload
                                                method='get'
                                                directory={true}
                                                multiple={true}
                                                showUploadList={false}
                                                onChange={(info) => {
                                                    loadFolder(info)
                                                }}>
                                                <Button style={{ 'marginTop': '25px' }} shape='round'
                                                    onClick={() => {

                                                        setImportDefinition({})
                                                        setFileToFunctions({})
                                                        setFunctionLinks([])
                                                    }}
                                                    icon={
                                                        <FolderOpenOutlined style={{ 'color': 'gray' }} />
                                                    }
                                                >
                                                </Button>
                                            </Upload>
                                        </Popover>

                                        <Popover content={<Typography>Open Graph</Typography>}>
                                            <Upload
                                                accept='.json'
                                                method='get'
                                                directory={false}
                                                multiple={false}
                                                showUploadList={false}
                                                onChange={(info) => {
                                                    dispatch({
                                                        'value': {
                                                            'isOpeningGraph': true,
                                                            'graphFile': info.file.originFileObj,
                                                            'isGraphVisible': true,
                                                        }
                                                    })
                                                    //console.log('true isOpeningGraph')
                                                    //console.log(info.file.originFileObj)
                                                }}>
                                                <Button style={{ 'marginTop': '25px' }} shape='round'
                                                    onClick={() => {
                                                    }}
                                                    icon={
                                                        <ForkOutlined style={{ 'color': 'gray' }} />
                                                    }
                                                >
                                                </Button>
                                            </Upload>
                                        </Popover>

                                        <Popover content={<Typography>Download Graph</Typography>}>

                                            <Button style={{ 'marginTop': '25px' }} shape='round'
                                                onClick={() => {
                                                    dispatch({
                                                        'value': {
                                                            'isDownloadingGraph': true,
                                                        }
                                                    })
                                                }}
                                                icon={
                                                    <DownloadOutlined style={{ 'color': 'gray' }} />
                                                }
                                                disabled={!state.isGraphVisible}
                                            >
                                            </Button>

                                        </Popover>

                                    </Space.Compact>
                                </Row>
                            </Col>
                        </Row>
                    </Row>
                </Layout.Header>
            </Affix>


            <Row justify='center' align='middle'
                style={{ 'height': '80vh', 'display': state.isGraphVisible ? 'none' : 'flex' }}>
                <Upload.Dragger method='get' directory={false} multiple={true} showUploadList={false} onChange={(info) => {
                    loadFolder(info)
                }}>
                    <div style={{ 'width': '400px', 'height': '200px' }}
                        onClick={() => {
                            setImportDefinition({})
                            setFileToFunctions({})
                            setFunctionLinks([])
                        }}>
                        <p className="ant-upload-drag-icon">
                            <FileSearchOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Easily upload your code file by clicking to select a file from your device or dragging a file and dropping into the box here.
                        </p>
                    </div>
                </Upload.Dragger>

                <Col style={{ 'width': '20px' }}></Col>
                <Upload.Dragger method='get' directory={true} multiple={true} showUploadList={false} onChange={(info) => {
                    loadFolder(info)
                }}>
                    <div style={{ 'width': '400px', 'height': '200px' }}
                        onClick={() => {
                            setImportDefinition({})
                            setFileToFunctions({})
                            setFunctionLinks([])
                        }}>
                        <p className="ant-upload-drag-icon">
                            <FolderOpenOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag folder to this area to upload</p>
                        <p className="ant-upload-hint">
                            Easily upload your code folder by clicking to select a folder from your device or dragging a folder and dropping into the box here.
                        </p>
                    </div>
                </Upload.Dragger>
            </Row>

            {
                state.isGraphVisible &&
                <>
                    <div style={{
                        'backgroundColor': 'white', 'height': '14px', 'width': '64px', 'zIndex': 1,
                        'position': 'fixed', 'bottom': '0px', 'right': '0px'
                    }}>

                    </div>
                    <DesktopGraphFlow />
                </>
            }


        </>
    );
};

export default DesktopGraph
