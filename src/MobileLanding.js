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
    GithubOutlined,
} from '@ant-design/icons'


import {
    useContext,
} from 'react'

import { Context } from './store/Context'

import { useNavigate } from 'react-router-dom'
import MobileHeader from './MobileHeader'

import MobileSectionList from './MobileSectionList'

function MobileLanding() {
    const { state, dispatch } = useContext(Context)

    const navigate = useNavigate()

    return (
        <Layout style={{ 'overflowX': 'hidden' }}>
            <MobileHeader />

            <Layout.Content>
                {/* cover headline */}
                <Row justify='center' align='middle' style={{ 'backgroundColor': 'white', 'height': '1000px', 'paddingTop': '50px' }}>
                    <Row justify='center' style={{ 'margin': '0px 20px' }}>
                        <Typography.Title level={2}>
                            {state.coverTitle}
                        </Typography.Title>
                    </Row>

                    <Row justify='center' style={{ 'padding': '0px 20px' }}>
                        <Typography style={{ 'fontSize': '16px' }}>
                            {state.coverText}
                        </Typography>
                    </Row>

                    <Row justify='center' style={{ 'margin': '20px' }}>
                        <Button type='primary' size='large' shape='round'
                            style={{ 'margin': '0px 5px', 'width': '150px' }}
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

                    <Row justify='center' style={{ 'marginTop': '20px' }}>
                        <Image preview={false} src={state.coverImage} style={{ 'width': '100vw' }}></Image>
                    </Row>
                </Row>

                {/* section list */}
                <MobileSectionList sectionList={state.sectionList} />


                {/* endorsement list */}
                <Row justify='center' align='top' style={{'height': '700px', 'padding': '70px 20px', 'backgroundColor': 'AliceBlue'}}>  

                    <Row justify='center' style={{'width': '100%'}}>
                        <Typography.Title level={2}>
                            {state.endorsementTitle}
                        </Typography.Title>
                    </Row>
                    <Row justify='center' style={{'margin': '20px'}}>

                        <Typography style={{'fontSize': '16px'}}>
                            {state.endorsementText}
                        </Typography>

                    </Row>
                    <Row justify='start' style={{'marginTop': '20px'}}>
                        {
                            state.endorsementList.map((endorsementItem, index) => {
                                return (
                                    <Col key={index} span={8} style={{'marginBottom': '20px'}}>
                                        <Tooltip placement='top' title={endorsementItem.title} color={endorsementItem.titleColor}>
                                            <a href={endorsementItem.URL} target='_blank' rel="noopener noreferrer">
                                                <Row justify='center'>
                                                    <Image height={50} width={50} preview={false} src={endorsementItem.image} 
                                                        style={{'boxShadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                                                    </Image>
                                                </Row>
                                            </a>
                                        </Tooltip>
                                    </Col>
                                )
                            })
                        }
                    </Row>

                </Row>


                {/* policies */}
                <Row justify='center' align='top' style={{ 'backgroundColor': 'white', 'height': '450px', 'padding': '70px 20px' }}>
                    {/*
                    <Row justify='center' align='top' style={{'width': '100%'}}>
                        <Button type="primary" shape="round" icon={<DownloadOutlined />} size='large' danger onClick={() => { window.scrollTo(0, 0)}}>Download</Button>
                    </Row>
                    */}
                    <Row justify='space-around' align='top' style={{ 'width': '100%' }}>
                        <Col>
                            <Row justify='start' align='middle'>
                                <Typography>
                                    Who we are
                                </Typography>
                            </Row>
                            <Row justify='start' align='middle' style={{ 'marginTop': '20px' }}>
                                <a href={'https://jomimi.com/policy/cookies'} target='_blank' rel="noopener noreferrer">
                                    <Typography.Title level={5} style={{ 'margin': '0px' }}>
                                        Cookies Policy
                                    </Typography.Title>
                                </a>
                            </Row>
                            <Row justify='start' align='middle' style={{ 'marginTop': '20px' }}>
                                <a href={'https://jomimi.com/policy/privacy'} target='_blank' rel="noopener noreferrer">
                                    <Typography.Title level={5} style={{ 'margin': '0px' }}>
                                        Privacy Policy
                                    </Typography.Title>
                                </a>
                            </Row>
                            <Row justify='start' align='middle' style={{ 'marginTop': '20px' }}>
                                <a href={'https://jomimi.com/policy/terms'} target='_blank' rel="noopener noreferrer">
                                    <Typography.Title level={5} style={{ 'margin': '0px' }}>
                                        Terms of Service
                                    </Typography.Title>
                                </a>
                            </Row>
                        </Col>


                        <Col >
                            <Row justify='start' align='middle'>
                                <Typography>
                                    Need help?
                                </Typography>
                            </Row>
                            <Row justify='start' align='middle' style={{ 'cursor': 'pointer', 'marginTop': '20px' }}>
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
                                                    <Image width={40} height={40} preview={false} src={state.discordImage}></Image>
                                                </Col>
                                                <Col style={{ 'marginLeft': '5px' }}>
                                                    <Typography>Discord</Typography>
                                                </Col>
                                            </Row>

                                        </a>
                                    </>
                                } trigger='click'>
                                    <Typography.Title level={5} style={{ 'margin': '0px' }}>
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

            {/*
            <Layout.Footer>


            </Layout.Footer>
            */}

        </Layout>
    )
}

export default MobileLanding
