import React from 'react'

import discordImage from '../images/discord.webp'
import emailImage from '../images/email_256.webp'

import opensign_logo from '../images/opensign_logo_512.png'
import opensign_banner from '../images/digital_signature.jpg'

import opensign_one from '../images/opensign_one.webp'
import opensign_two from '../images/opensign_two.webp'
import opensign_three from '../images/opensign_three.webp'
import opensign_four from '../images/opensign_four.webp'
import opensign_five from '../images/opensign_five.webp'
import opensign_six from '../images/opensign_six.webp'

// endorsement images
import amplichat_filled from '../images/amplichat.png'
import dreamhub_filled from '../images/dreamhub_filled.png'
import voiceqna_filled from '../images/voiceqna_fill_v2_gradient.png'
import voicemirror_filled from '../images/voice_mirror_v_1024.png'

import bazipaipai_filled from '../images/bazipaipai_64_filled.png'

import spindrifthome_filled from '../images/sh_unfill_1024.png'

import jomimi_filled from '../images/alpaca_logo_v3_filled_512.png'
import mailgpt_filled from '../images/mailgpt_logo_512.webp'

import paper_filled from '../images/paper_bird_512_filled.png'
import realkit_filled from '../images/realkit_logo.webp'

import codeviz_banner from '../images/codeviz_banner.png'
import codeviz_logo from '../images/codeviz_logo_512.png'


import codeflow_one from '../images/codeflow_one.webp'
import codeflow_two from '../images/codeflow_two.webp'
import codeflow_three from '../images/codeflow_three.webp'
import codeflow_four from '../images/codeflow_four.webp'

export const initialState = {
    // when in dev, change appURL to local url
    // appURL: 'http://localhost:3000',  
    // when in production, change appURL to real url
    // appURL: 'https://opensign.jomimi.com',

    appURL: process.env.REACT_APP_URI,

    appLogo: codeviz_logo,
    appName: 'CodeFlow',
    coverTitle: 'Instant Code Base Insights for Any Language',
    coverText: 'CodeFlow is an open-source platform designed to help developers, teams, and organizations quickly grasp any code base. Whether you are working with Python, C++, Java, JavaScript, or even more specialized languages like Rust, Swift, or Kotlin, CodeFlow provides an instant overview of code structures, dependencies, and key insights. No more time wasted trying to understand unfamiliar code—get a brief and concise understanding in seconds.',
    coverImage: codeviz_banner,

    discordImage: discordImage,
    discordLink: 'https://discord.gg/AwRv3QZuKP',

    emailImage: emailImage,
    emailLink: 'mailto:contact@jomimi.com',

    sectionList: [
        {
            'title': `Multi-Language Support`,
            'text': `CodeFlow supports a wide range of programming languages. CodeFlow is built to scale for projects of any size, across any technology stack.`,
            'image': codeflow_one,
        },
        {
            'title': `Instant Code Insights`,
            'text': `Need a quick sense of how a project is structured? CodeFlow gives you an immediate understanding of a code base, including function dependencies, class hierarchies, and important code segments. No matter the complexity, CodeFlow parses through the project, delivering key insights that make it easier to onboard, collaborate, and debug.`,
            'image': codeflow_two,
        },
        {
            'title': `Open-Source and Customizable`,
            'text': `As an open-source platform, CodeFlow is highly customizable. Developers can contribute, extend features, or adapt the platform to their unique project needs. Whether you’re working on an enterprise-scale project or an open-source library, CodeFlow allows you to modify and tailor it for your use case.`,
            'image': codeflow_three,
        },
        {
            'title': `Cross-Platform Integration`,
            'text': `CodeFlow integrates smoothly with popular version control systems like Git, and it works across platforms. No matter if you’re working on Linux, macOS, or Windows, CodeFlow can be adapted to analyze your code base and provide feedback directly within your development environment.`,
            'image': codeflow_four,
        },
    ],

    endorsementTitle: `Trusted by Innovative Startups`,
    endorsementText: `CodeFlow powers infrastructure within AmpliChat, DreamHub, VoiceQnA, VoiceMirror, BaZiPaiPai, SpindriftHome, MailGPT, Jomimi, Paper, RealKit`,
    endorsementList: [
        {
            title: `AmpliChat: Event Chat App`,
            titleColor: `black`,
            image: amplichat_filled,
            URL: `https://amplichat.com`,
        },
        {
            title: `DreamHub: Visualized Stories`,
            titleColor: `black`,
            image: dreamhub_filled,
            URL: `https://dreamhub.app`,
        },
        {
            title: `VoiceQnA: Speak a New Language`,
            titleColor: `black`,
            image: voiceqna_filled,
            URL: `https://voiceqna.com`,
        },
        {
            title: `VoiceMirror: Travel Translator`,
            titleColor: `black`,
            image: voicemirror_filled,
            URL: `https://mirror.voiceqna.com`,
        },
        {
            title: `BaZiPaiPai: Fate and Destiny`,
            titleColor: `black`,
            image: bazipaipai_filled,
            URL: `https://bazipaipai.com`,
        },
        {
            title: `SpindriftHome: HOA Management`,
            titleColor: `black`,
            image: spindrifthome_filled,
            URL: `https://spindrifthome.com`,
        },
        {
            title: `MailGPT: Email Writing Assistant`,
            titleColor: `black`,
            image: mailgpt_filled,
            URL: `https://mail.jomimi.com`,
        },
        {
            title: `Jomimi: App Development`,
            titleColor: `black`,
            image: jomimi_filled,
            URL: `https://jomimi.com`,
        },
        {
            title: `Paper: Academic Snapshots`,
            titleColor: `black`,
            image: paper_filled,
            URL: `https://paper.jomimi.com`,
        },
        {
            title: `RealKit: Real Estate Tools`,
            titleColor: `black`,
            image: realkit_filled,
            URL: `https://realkit.jomimi.com`,
        },
    ],



    initialNodes: [
        {
            id: '1',
            type: 'input',
            data: { label: 'Node 0' },
            position: { x: 250, y: 5 },
            className: 'light',
        },
        {
            id: '2',
            data: { label: 'Group A' },
            position: { x: 100, y: 100 },
            className: 'light',
            style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
        },
        {
            id: '2a',
            data: { label: 'Node A.1' },
            position: { x: 10, y: 50 },
            parentId: '2',
        },
        {
            id: '3',
            data: { label: 'Node 1' },
            position: { x: 320, y: 100 },
            className: 'light',
        },
        {
            id: '4',
            data: { label: 'Group B' },
            position: { x: 320, y: 200 },
            className: 'light',
            style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 300, height: 300 },
        },
        {
            id: '4a',
            data: { label: 'Node B.1' },
            position: { x: 15, y: 65 },
            className: 'light',
            parentId: '4',
            extent: 'parent',
        },
        {
            id: '4b',
            data: { label: 'Group B.A' },
            position: { x: 15, y: 120 },
            className: 'light',
            style: {
                backgroundColor: 'rgba(255, 0, 255, 0.2)',
                height: 150,
                width: 270,
            },
            parentId: '4',
        },
        {
            id: '4b1',
            data: { label: 'Node B.A.1' },
            position: { x: 20, y: 40 },
            className: 'light',
            parentId: '4b',
        },
        {
            id: '4b2',
            data: { label: 'Node B.A.2' },
            position: { x: 100, y: 100 },
            className: 'light',
            parentId: '4b',
        },
    ],
    
    initialEdges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-3', source: '1', target: '3', animated: true },
        { id: 'e2a-4a', source: '2a', target: '4a', animated: true },
        { id: 'e3-4b', source: '3', target: '4b', animated: true },
        { id: 'e4a-4b1', source: '4a', target: '4b1', animated: true },
        { id: 'e4a-4b2', source: '4a', target: '4b2', animated: true },
        { id: 'e4b1-4b2', source: '4b1', target: '4b2', animated: true },
    ],


    file_definition: {},
    import_definition: {},
    function_definition: {},
    file_to_functions: {},
    function_links: [],
    rerenderGraph: false,
}


const initialContext = {
    state: initialState,
    dispatch: () => null,
}

export const Context = React.createContext(initialContext)