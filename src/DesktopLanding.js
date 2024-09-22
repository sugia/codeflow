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
    GithubOutlined,
} from '@ant-design/icons'


import {
    useContext,
} from 'react'

import { Context } from './store/Context'

import { useNavigate } from 'react-router-dom'
import DesktopHeader from './DesktopHeader'
import DesktopSectionList from './DesktopSectionList'

function DesktopLanding() {
    const { state, dispatch } = useContext(Context)

    const navigate = useNavigate()

    return (
        <Layout style={{ 'minWidth': '1000px' }}>
            <DesktopHeader />

            <Layout.Content>
                {/* cover headline */}
                <Row justify='center' align='middle' style={{ 'backgroundColor': 'white', 'height': '1000px' }}>
                    <Row justify='center' align='middle' style={{ 'width': '1400px' }}>
                        <Col style={{ 'width': '50%' }}>
                            <Row justify='center' style={{ 'padding': '0px 50px' }}>
                                <Typography.Title>
                                    {state.coverTitle}
                                </Typography.Title>

                            </Row>

                            <Row justify='center' style={{ 'padding': '0px 50px' }}>
                                <Typography style={{ 'fontSize': '16px' }}>
                                    {state.coverText}
                                </Typography>
                            </Row>

                            <Row justify='center' style={{ 'marginTop': '50px' }}>
                                <Button type='primary' size='large' shape='round'
                                    style={{ 'margin': '0px 10px', 'width': '150px' }}
                                    onClick={() => {
                                        window.open(state.appURL + '/graph', '_self')
                                    }}>
                                    <Typography.Title level={5} style={{ 'color': 'white', 'marginTop': '7px' }}>
                                        Get Started
                                    </Typography.Title>
                                </Button>

                                <Button type='primary' size='large' shape='round' icon={<GithubOutlined />}
                                    style={{ 'margin': '0px 10px', 'color': 'white', 'backgroundColor': 'black', 'width': '150px' }}
                                    onClick={() => {
                                        window.open('https://github.com/sugia/codeflow', '_blank')
                                    }}>
                                    <Typography.Title level={5} style={{ 'color': 'white', 'marginTop': '7px' }}>
                                        Github
                                    </Typography.Title>
                                </Button>
                            </Row>
                        </Col>

                        <Col style={{ 'width': '50%' }}>
                            <Row justify='start'>
                                <Image preview={false} src={state.coverImage}></Image>
                            </Row>
                        </Col>
                    </Row>
                </Row>

                {/* section list */}
                <DesktopSectionList sectionList={state.sectionList} />

                {/* endorsement list */}
                <Row justify='center' align='middle' style={{'height': '700px', 'padding': '100px', 'backgroundColor': 'aliceblue'}}>
                    <Row justify='center' style={{'maxWidth': '1000px'}}>
                
                        <Row justify='center' style={{'width': '100%'}}>
                            <Typography.Title>
                                {state.endorsementTitle}
                            </Typography.Title>
                        </Row>
                        <Row justify='center' style={{'width': '750px'}}>
                            <Typography style={{'fontSize': '16px'}}>
                                {state.endorsementText}
                            </Typography>
                        </Row>

                        <Row justify='center' style={{'marginTop': '50px', 'width': '100%'}}>
                            {
                                state.endorsementList.map((endorsementItem, index) => {
                                    return (
                                        <Col span={2} key={index}>
                                            <Tooltip placement='top' title={endorsementItem.title} color={endorsementItem.titleColor}>
                                            <a href={endorsementItem.URL} target='_blank' rel="noopener noreferrer">
                                                <Image height={70} preview={false} src={endorsementItem.image} style={{'boxShadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}></Image>
                                            </a>
                                            </Tooltip>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                 
                    </Row>
                </Row>

                {/* policies */}
                <Row justify='center' align='middle' style={{ 'backgroundColor': 'white', 'height': '500px', 'padding': '100px' }}>
                    <Row justify='left' align='top' style={{ 'maxWidth': '2000px', 'width': '100%' }}>
                        {/*
                    <Col style={{'padding': '0px 20px'}}>
                        <Row justify='start' align='middle' style={{'cursor': 'pointer'}} onClick={() => { window.scrollTo(0, 0)}}>
                            <Col>
                                <Image height={30} preview={false} src={state.appLogo} style={{'filter': "grayscale(1)", 'opacity': '0.7'}}></Image>
                            </Col>
                            <Col>
                                <Typography.Title level={3} style={{'color': 'gray', 'marginLeft': '10px'}}>{state.appName}</Typography.Title>
                            </Col>
                        </Row>

                        <Row justify='start' align='middle' style={{'marginTop': '125px'}}>
                            <Col>
                                <Button type="primary" shape="round" icon={<DownloadOutlined />} size='large' danger onClick={() => { window.scrollTo(0, 0)}}>Download</Button>
                            </Col>
                        </Row>
                    </Col>
                    */}


                        <Col style={{ 'padding': '0px 20px' }}>
                            <Row justify='start' align='middle' style={{ 'margin': '20px 0' }}>
                                <Typography>
                                    Who we are
                                </Typography>
                            </Row>
                            <Row justify='start' align='middle'>
                                <a href={'https://jomimi.com/policy/cookies'} target='_blank' rel="noopener noreferrer">
                                    <Typography.Title level={5}>
                                        Cookies Policy
                                    </Typography.Title>
                                </a>
                            </Row>
                            <Row justify='start' align='middle'>
                                <a href={'https://jomimi.com/policy/privacy'} target='_blank' rel="noopener noreferrer">
                                    <Typography.Title level={5}>
                                        Privacy Policy
                                    </Typography.Title>
                                </a>
                            </Row>
                            <Row justify='start' align='middle'>
                                <a href={'https://jomimi.com/policy/terms'} target='_blank' rel="noopener noreferrer">
                                    <Typography.Title level={5}>
                                        Terms of Service
                                    </Typography.Title>
                                </a>
                            </Row>
                        </Col>

                        <Col style={{ 'padding': '0px 20px' }}>
                            <Row justify='start' align='middle' style={{ 'margin': '20px 0' }}>
                                <Typography>
                                    Need help?
                                </Typography>
                            </Row>
                            <Row justify='start' align='middle' style={{ 'cursor': 'pointer' }}>
                                <Popover placement='top' title='Contact Us' content={
                                    <>
                                        <a href={state.emailLink} target='_blank' rel="noopener noreferrer">
                                            <Row justify='start' align='middle'>
                                                <Col>
                                                    <Image height={40} preview={false} src={state.emailImage}></Image>
                                                </Col>
                                                <Col style={{ 'marginLeft': '5px' }}>
                                                    <Typography>Email</Typography>
                                                </Col>
                                            </Row>
                                        </a>
                                        <Divider style={{ 'margin': '5px' }} />
                                        <a href={state.discordLink} target='_blank' rel="noopener noreferrer">
                                            <Row justify='start' align='middle'>
                                                <Col>
                                                    <Image height={40} preview={false} src={state.discordImage}></Image>
                                                </Col>
                                                <Col style={{ 'marginLeft': '5px' }}>
                                                    <Typography>Discord</Typography>
                                                </Col>
                                            </Row>
                                        </a>
                                    </>
                                } trigger='click'>
                                    <Typography.Title level={5}>
                                        Contact Us
                                    </Typography.Title>
                                </Popover>
                            </Row>
                        </Col>
                    </Row>
                </Row>

                <Row justify="center" align='middle' style={{ 'backgroundColor': 'white', 'padding': '0 0 40px 0' }}>
                    <Col>
                        <Typography.Text type="secondary" style={{ 'fontSize': 12 }}>
                            {state.appName} © {new Date().getFullYear()}
                        </Typography.Text>
                    </Col>
                </Row>

            </Layout.Content>

        </Layout>
    )
}

export default DesktopLanding
