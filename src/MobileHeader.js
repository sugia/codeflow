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


function MobileHeader() {
    const { state, dispatch } = useContext(Context)

    const navigate = useNavigate()

    return (
        <Affix offsetTop={0}>
            <Layout.Header style={{ 'background': 'white', 'width': '100%', 'padding': '0px 0px 0px 16px' }}>
                <Row justify='space-between' align='middle' style={{ 'backgroundColor': 'white', 'width': '100%', 'height': '100%' }}>
                    <Col onClick={() => { window.scrollTo(0, 0) }}>
                        <Row>
                            <Col>
                                <Image width={32} height={32} preview={false} src={state.appLogo}></Image>
                            </Col>
                            <Col>
                                <Typography.Title level={4}
                                    style={{ 'color': 'black', 'margin': '20px 0px 0px 4px' }}>
                                    {state.appName}
                                </Typography.Title>
                            </Col>
                        </Row>
                    </Col>


                </Row>
            </Layout.Header>
        </Affix>
    )
}

export default MobileHeader