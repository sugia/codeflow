import * as lua from '../store/languages/lua'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('lua.getImportDefinition', () => {
    const fileName = 'test.lua'
    const code = `
        require("socket")
        require 'lfs'
        require("my_module")
    `
    const res = lua.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "socket-socket": new Set([
            { "file_key_source": "socket", "file_key_target": "test", "function_name": "socket" }
        ]),
        "lfs-lfs": new Set([
            { "file_key_source": "lfs", "file_key_target": "test", "function_name": "lfs" }
        ]),
        "my_module-my_module": new Set([
            { "file_key_source": "my_module", "file_key_target": "test", "function_name": "my_module" }
        ]),
    })
})

test('lua.getFileToFunctions', () => {
    const fileName = 'test.lua'
    const code = `
        function greet(name)
            print("Hello, " .. name)
        end

        local function sum(a, b)
            return a + b
        end

        function myTable:printValue(value)
            print(value)
        end
    `

    const res = lua.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.lua": new Set([
            {
                "function_name": "greet",
                "function_parameters": "name",
            },
            {
                "function_name": "sum",
                "function_parameters": "a, b",
            },
            {
                "function_name": "printValue",
                "function_parameters": "value",
            },
        ])
    })
})


test('lua.getFunctionLinks', () => {
    const fileName = 'test.lua'
    const code = `
        require("socket")
        require 'lfs'
        require("my_module")

        function greet(name)
            socket.socket()
            print("Hello, " .. name)
        end

        local function sum(a, b)
            lfs.function()
            return a + b
        end

        function myTable:printValue(value)
            my_module.call()
            print(value)
        end
    `

    const res = lua.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-greet": new Set([
            "socket-socket",
        ]),
        "test-sum": new Set([
            "lfs-lfs",
        ]),
        "test-printValue": new Set([
            "my_module-my_module",
        ]),
    }
    )
})
