import {
    Typography,
    Layout,
    Row,
    Col,
    Affix,
    Image,
    Button,
    Tooltip,
    Popover,
    Divider,
} from 'antd'

import {
    DownloadOutlined,
} from '@ant-design/icons'


import {
    useContext,
} from 'react'

import { Context } from './store/Context'

import { useNavigate } from 'react-router-dom'


function DesktopHeader() {

    const { state, dispatch } = useContext(Context)

    const navigate = useNavigate()

    return (
        <Affix offsetTop={0} style={{ 'position': 'absolute', 'width': '100vw' }}>
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

                    </Row>
                </Row>
            </Layout.Header>
        </Affix>
    )

}


export default DesktopHeader