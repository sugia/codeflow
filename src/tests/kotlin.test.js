import * as kotlin from '../store/languages/kotlin'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('kotlin.getImportDefinition', () => {
    const fileName = 'test.kt'
    const code = `
        import kotlin.collections.List
        import java.util.ArrayList
        import com.myapp.utils.Helper
    `
    const res = kotlin.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "collections-List": new Set([
            { "file_key_source": "collections", "file_key_target": "test", "function_name": "List" }
        ]),
        "util-ArrayList": new Set([
            { "file_key_source": "util", "file_key_target": "test", "function_name": "ArrayList" }
        ]),
        "utils-Helper": new Set([
            { "file_key_source": "utils", "file_key_target": "test", "function_name": "Helper" }
        ]),
        "List-List": new Set([
            { "file_key_source": "List", "file_key_target": "test", "function_name": "List" }
        ]),
        "ArrayList-ArrayList": new Set([
            { "file_key_source": "ArrayList", "file_key_target": "test", "function_name": "ArrayList" }
        ]),
        "Helper-Helper": new Set([
            { "file_key_source": "Helper", "file_key_target": "test", "function_name": "Helper" }
        ]),
    })
})

test('kotlin.getFileToFunctions', () => {
    const fileName = 'test.kt'
    const code = `
        fun sayHello(name: String) {
            println("Hello, \$name")
        }

        fun add(a: Int, b: Int): Int {
            return a + b
        }

        fun noParams(): String {
            return "This function has no parameters"
        }
    `

    const res = kotlin.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.kt": new Set([
            {
                "function_name": "sayHello",
                "function_parameters": "name: String",
                "return_type": null,
            },
            {
                "function_name": "add",
                "function_parameters": "a: Int, b: Int",
                "return_type": "Int",
            },
            {
                "function_name": "noParams",
                "function_parameters": "",
                "return_type": "String",
            },
        ])
    })
})


test('kotlin.getFunctionLinks', () => {
    const fileName = 'test.kt'
    const code = `
        import kotlin.collections.List
        import java.util.ArrayLink
        import com.myapp.utils.Helper

        fun sayHello(name: String) {
            List()
            println("Hello, \$name")
        }

        fun add(a: Int, b: Int): Int {
            ArrayLink()
            return a + b
        }

        fun noParams(): String {
            Helper.helper()
            return "This function has no parameters"
        }
    `

    const res = kotlin.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-sayHello": new Set([
            "List-List",
            "collections-List",
        ]),
        "test-add": new Set([
            "ArrayLink-ArrayLink",
            "util-ArrayLink",
        ]),
        "test-noParams": new Set([
            "Helper-Helper",
            "utils-Helper",
        ]),
    }
    )
})
