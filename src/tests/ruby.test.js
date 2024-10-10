import * as ruby from '../store/languages/ruby'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('ruby.getImportDefinition', () => {
    const fileName = 'test.rb'
    const code = `
        require 'json'
        require_relative 'lib/utils'
        require 'net/http'
        require_relative "lib/another_utils"
    `
    const res = ruby.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "json-json": new Set([
            { "file_key_source": "json", "file_key_target": "test", "function_name": "json" }
        ]),
        "http-http": new Set([
            { "file_key_source": "http", "file_key_target": "test", "function_name": "http" }
        ]),
        "net-http": new Set([
            { "file_key_source": "net", "file_key_target": "test", "function_name": "http" }
        ]),
        "utils-utils": new Set([
            { "file_key_source": "utils", "file_key_target": "test", "function_name": "utils" }
        ]),
        "another_utils-another_utils": new Set([
            { "file_key_source": "another_utils", "file_key_target": "test", "function_name": "another_utils" }
        ]),
        "lib-utils": new Set([
            { "file_key_source": "lib", "file_key_target": "test", "function_name": "utils" }
        ]),

        "lib-another_utils": new Set([
            { "file_key_source": "lib", "file_key_target": "test", "function_name": "another_utils" }
        ]),
    })
})

test('ruby.getFileToFunctions', () => {
    const fileName = 'test.rb'
    const code = `
        def say_hello(name)
            puts "Hello, #{name}"
        end

        def add(a, b)
            return a + b
        end

        def no_params
            "This method has no parameters"
        end
    `

    const res = ruby.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.rb": new Set([
            {
                "function_name": "say_hello",
                "function_parameters": "name",
            },
            {
                "function_name": "add",
                "function_parameters": "a, b",
            },
            {
                "function_name": "no_params",
                "function_parameters": "",
            },
        ])
    })
})


test('ruby.getFunctionLinks', () => {
    const fileName = 'test.rb'
    const code = `
        require 'json'
        require_relative 'lib/utilslib'
        require 'net/http'
        require_relative "lib/another_utils"

        def say_hello(name)
            json.from()
            puts "Hello, #{name}"
        end

        def add(a, b)
            utilslib.add()
            http.call()
            return a + b
        end

        def no_params
            another_utils.call()
            "This method has no parameters"
        end
    `

    const res = ruby.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-say_hello": new Set([
            "json-json",
        ]),
        "test-add": new Set([
            "utilslib-utilslib",
            "http-http",
            "lib-utilslib",
            "net-http",
        ]),
        "test-no_params": new Set([
            "another_utils-another_utils",
            "lib-another_utils",
        ]),
    }
    )
})
