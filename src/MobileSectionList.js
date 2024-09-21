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
import MobileHeader from './MobileHeader'



// props: sectionItem, backgroundColor
function SectionItem(props) {
    return (
        <Row justify='center' align='top' style={{ 'backgroundColor': props.backgroundColor, 'height': '750px', 'padding': '70px 20px' }}>
            <motion.div
                initial={{ x: -300, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1, transition: { type: 'spring', bounce: 0, duration: 1 } }}
                viewport={{ once: true }}>
                <Row justify='center'>
                    <Typography.Title level={2}>
                        {props.sectionItem.title}
                    </Typography.Title>
                </Row>
                <Row justify='center'>
                    <Typography style={{ 'fontSize': '16px' }}>
                        {props.sectionItem.text}
                    </Typography>
                </Row>
            </motion.div>

            <motion.div
                initial={{ x: -300, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1, transition: { type: 'spring', bounce: 0, duration: 1 } }}
                viewport={{ once: true }}>
                <Image preview={false} src={props.sectionItem.image}
                    style={{ 'boxShadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', 'maxHeight': '400px' }}>
                </Image>
            </motion.div>

            <Row style={{ 'height': '20px' }} />
        </Row>
    )
}

// props: sectionList
function MobileSectionList(props) {
    return (
        <>
            {
                props.sectionList.map((sectionItem, index) => {
                    return (
                        <SectionItem sectionItem={sectionItem} backgroundColor={index % 2 === 1 ? 'white' : null} key={index} />
                    )

                })
            }
        </>
    )
}


export default MobileSectionList