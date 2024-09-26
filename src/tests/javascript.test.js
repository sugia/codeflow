import * as javascript from '../store/languages/javascript'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('javascript.getImportDefinition', () => {
    const fileName = 'Test.js'
    const code = `
        import React from 'react'
        import { useState, useEffect } from 'react'
        import * as Utils from './utils'
        import './styles.css'
        import defaultExport, { namedExport1, namedExport2 } from './module'
    `
    const res = javascript.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "module-defaultExport": new Set([
            { "file_key_source": "module", "file_key_target": "Test", "function_name": "defaultExport" }
        ]),
        "module-namedExport1": new Set([
            { "file_key_source": "module", "file_key_target": "Test", "function_name": "namedExport1" }
        ]),
        "module-namedExport2": new Set([
            { "file_key_source": "module", "file_key_target": "Test", "function_name": "namedExport2" }
        ]),
        "react-React": new Set([
            { "file_key_source": "react", "file_key_target": "Test", "function_name": "React" }
        ]),
        "react-useEffect": new Set([
            { "file_key_source": "react", "file_key_target": "Test", "function_name": "useEffect" }
        ]),
        "react-useState": new Set([
            { "file_key_source": "react", "file_key_target": "Test", "function_name": "useState" }
        ]),
        "utils-Utils": new Set([
            { "file_key_source": "utils", "file_key_target": "Test", "function_name": "Utils" }
        ]),
    })
})

test('javascript.getFileToFunctions', () => {
    const fileName = 'Test.js'
    const code = `
    function add(a, b) {
        if (a > b) {
            return a;
        } else {
        if (1 < 2) {
            return 1
        } else {
            if (2 < 3) {
                return 2
            } else {
                return 3 
            }
        }
            return b;
        }
    }

    const multiply = (x, y) => {
        return x * y;
    }

    const subtract = function(a, b) {
        return a - b;
    }
    `

    const res = javascript.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "Test.js": new Set([
            {
                "function_name": "add",
                "function_parameters": "a, b",
            },
            {
                "function_name": "multiply",
                "function_parameters": "x, y",
            },
            {
                "function_name": "subtract",
                "function_parameters": "a, b",
            },
        ])
    })
})


test('javascript.getFunctionLinks', () => {
    const fileName = 'Test.js'
    const code = `
        import Example from './Example'
        import { useX, useY } from 'xy'
        import * as Utils from './utils'
        import './styles.css'
        import defaultExport, { namedExport1, namedExport2 } from './module'

        function add(a, b) {
            useX()
            useY()
            return a + b
        }

        const multiply = (x, y) => {
            add(x, y)
            defaultExport()
            return x * y
        }

        const subtract = function(a, b) {
            namedExport1()
            namedExport2()
            return a - b
        }
    `

    const res = javascript.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "Test-add": new Set([
            "xy-useX",
            "xy-useY",
        ]),
        "Test-multiply": new Set([
            "Test-add",
            "module-defaultExport",
        ]),
        "Test-subtract": new Set([
            "module-namedExport1",
            "module-namedExport2",
        ]),
    }
    )
})
