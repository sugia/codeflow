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
    ForkOutlined,
    DownloadOutlined,
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

import MobileHeader from './MobileHeader'
import MobileGraphFlow from './MobileGraphFlow'

import {
    languageMap,
} from './store/utils'


const getFileExtension = (fileName) => {
    const extension = fileName.slice(fileName.lastIndexOf('.'));
    return extension || 'Static File'
}

const MobileGraph = () => {
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
                <Layout.Header style={{ 'background': 'white', 'width': '100%', 'padding': '0px' }}>
                    <Row justify='space-between' align='middle'
                        style={{ 'backgroundColor': 'white', 'width': '100%', 'height': '100%', 'padding': '0px 16px' }}>

                        <Col>
                            <Row justify='center' align='middle'>
                                <Col>
                                    <Image width={32} height={32} preview={false} src={state.appLogo}></Image>
                                </Col>
                                <Col>
                                    <Typography.Title level={4}
                                        style={{ 'color': 'black', 'margin': '4px 0px 0px 4px' }}>
                                        {state.appName}
                                    </Typography.Title>
                                </Col>
                            </Row>
                        </Col>


                        <Col>
                            <Row justify='center'>
                                <Space.Compact>
                                    <Upload method='get' directory={false} multiple={true} showUploadList={false} onChange={(info) => {
                                        loadFolder(info)
                                    }}>
                                        <Button style={{ 'marginTop': '5px' }} shape='round'
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

                                    <Upload method='get' directory={true} multiple={true} showUploadList={false} onChange={(info) => {
                                        loadFolder(info)
                                    }}>
                                        <Button style={{ 'marginTop': '5px' }} shape='round'
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
                                        <Button style={{ 'marginTop': '5px' }} shape='round'
                                            onClick={() => {
                                            }}
                                            icon={
                                                <ForkOutlined style={{ 'color': 'gray' }} />
                                            }
                                        >
                                        </Button>
                                    </Upload>


                                    <Button style={{ 'marginTop': '5px' }} shape='round'
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

                                </Space.Compact>
                            </Row>
                        </Col>

                    </Row>
                </Layout.Header>
            </Affix>


            <Row justify='center' align='middle'
                style={{ 'height': '80vh', 'display': state.isGraphVisible ? 'none' : 'flex' }}>

                <Upload.Dragger
                    style={{ 'marginTop': '100px' }}
                    method='get'
                    directory={false}
                    multiple={true}
                    showUploadList={false}
                    onChange={(info) => {
                        loadFolder(info)
                    }}>
                    <div style={{ 'width': '100%', 'height': '200px', 'maxWidth': '400px' }}
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

                <Upload.Dragger
                    style={{ 'marginTop': '50px' }}
                    method='get'
                    directory={true}
                    multiple={true}
                    showUploadList={false}
                    onChange={(info) => {
                        loadFolder(info)
                    }}>
                    <div style={{ 'width': '100%', 'height': '200px', 'maxWidth': '400px' }}
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
                    <MobileGraphFlow />
                </>
            }
        </>
    );
};

export default MobileGraph
