import * as swift from '../store/languages/swift'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('swift.getImportDefinition', () => {
    const fileName = 'test.swift'
    const code = `
        import UIKit
        import Foundation
        import MyCustomFramework
    `
    const res = swift.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "UIKit-UIKit": new Set([
            { "file_key_source": "UIKit", "file_key_target": "test", "function_name": "UIKit" }
        ]),
        "Foundation-Foundation": new Set([
            { "file_key_source": "Foundation", "file_key_target": "test", "function_name": "Foundation" }
        ]),
        "MyCustomFramework-MyCustomFramework": new Set([
            { "file_key_source": "MyCustomFramework", "file_key_target": "test", "function_name": "MyCustomFramework" }
        ]),
    })
})

test('swift.getFileToFunctions', () => {
    const fileName = 'test.swift'
    const code = `
        func sayHello(name: String) {
            print("Hello, \\(name)")
        }
        
        func add(a: Int, b: Int) -> Int {
            return a + b
        }
        
        func noParams() -> String {
            return "This function has no parameters"
        }
    `

    const res = swift.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.swift": new Set([
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


test('swift.getFunctionLinks', () => {
    const fileName = 'test.swift'
    const code = `
        import UIKit
        import Foundation
        import MyCustomFramework

        func sayHello(name: String) {
            print("Hello, \\(name)")
        }
        
        func add(a: Int, b: Int) -> Int {
            return a + b
        }
        
        func noParams() -> String {
            return "This function has no parameters"
        }
    `

    const res = swift.getFunctionLinks(fileName, code)

    expect(res).toEqual({
    }
    )
})
