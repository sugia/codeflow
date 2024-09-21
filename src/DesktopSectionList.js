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
    motion,
} from 'framer-motion'

import {
    useContext,
} from 'react'

import { Context } from './store/Context'

import { useNavigate } from 'react-router-dom'
import DesktopHeader from './DesktopHeader'


// props: image
function FloatImageCol(props) {
    return (
        <Col span={12}>
            <Row justify='center'>
            <motion.div 
                    initial={{y: 300, opacity: 0}} 
                    whileInView={{y: 0, opacity: 1, transition: {type: 'spring', bounce: 0, duration: 1}}} 
                    viewport={{once: true}}>
                <Image height={400} preview={false} src={props.image} style={{'boxShadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}></Image>
            </motion.div>
            </Row>
        </Col>
    )
}

// props title, text
function FloatTextCol(props) {
    return (
        <Col span={12}>
            <motion.div 
                    initial={{y: 300, opacity: 0}} 
                    whileInView={{y: 0, opacity: 1, transition: {type: 'spring', bounce: 0, duration: 1}}} 
                    viewport={{once: true}}>
                <Row justify='center' style={{'padding': '0px 50px'}}>
                    <Typography.Title>
                        {props.title}
                    </Typography.Title>
                </Row>
                <Row justify='center' style={{'padding': '0px 50px'}}>
                    <Typography style={{'fontSize': '16px'}}>
                        {props.text}
                    </Typography>
                </Row>
            </motion.div>
        </Col>
    )
}

// props: sectionItem, backgroundColor
function SectionItemImageOnTheLeft(props) {
    return (
        <Row justify='center' align='middle' style={{'backgroundColor': props.backgroundColor, 'height': '700px', 'padding': '100px'}}>
            <Row justify='center' align='middle' style={{'maxWidth': '2000px'}}>
                <FloatImageCol image={props.sectionItem.image} />
                <FloatTextCol title={props.sectionItem.title} text={props.sectionItem.text} />
            </Row>
        </Row>
    )
}

// props: sectionItem, backgroundColor
function SectionItemImageOnTheRight(props) {
    return (
        <Row justify='center' align='middle' style={{'backgroundColor': props.backgroundColor, 'height': '700px', 'padding': '100px'}}>
            <Row justify='center' align='middle' style={{'maxWidth': '2000px'}}>
                <FloatTextCol title={props.sectionItem.title} text={props.sectionItem.text} />
                <FloatImageCol image={props.sectionItem.image} />
            </Row>
        </Row>
    )
}

// props: sectionList
function DesktopSectionList(props) {
    return (
        <>
        {
            props.sectionList.map((sectionItem, index) => {
                return (
                    index % 2 === 0?
                        <SectionItemImageOnTheLeft sectionItem={sectionItem} backgroundColor={null} key={index} />
                        :
                        <SectionItemImageOnTheRight sectionItem={sectionItem} backgroundColor={'white'} key={index} />
                )

            })
        }
        </>
    )
}

export default DesktopSectionList