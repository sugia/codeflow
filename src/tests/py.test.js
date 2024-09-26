import * as py from '../store/languages/py'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('py.getImportDefinition', () => {
    const fileName = 'test.py'
    const code = `
        import os
        import sys, json
        from collections import defaultdict, Counter
        from mymodule import myfunc
    `
    const res = py.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "Lib-os": new Set([
            { "file_key_source": "Lib", "file_key_target": "test", "function_name": "os" }
        ]),
        "Lib-sys": new Set([
            { "file_key_source": "Lib", "file_key_target": "test", "function_name": "sys" }
        ]),
        "Lib-json": new Set([
            { "file_key_source": "Lib", "file_key_target": "test", "function_name": "json" }
        ]),
        "collections-defaultdict": new Set([
            { "file_key_source": "collections", "file_key_target": "test", "function_name": "defaultdict" }
        ]),
        "collections-Counter": new Set([
            { "file_key_source": "collections", "file_key_target": "test", "function_name": "Counter" }
        ]),
        "mymodule-myfunc": new Set([
            { "file_key_source": "mymodule", "file_key_target": "test", "function_name": "myfunc" }
        ]),
    })
})

test('py.getFileToFunctions', () => {
    const fileName = 'test.py'
    const code = `
        def add(a, b):
            return a + b

        def subtract(a, b):
            return a - b

        class MyClass:
            def my_method(self):
                pass

        def no_params():
            pass
    `

    const res = py.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.py": new Set([
            {
                "function_name": "add",
                "function_parameters": "a, b",
            },
            {
                "function_name": "subtract",
                "function_parameters": "a, b",
            },
            {
                "function_name": "my_method",
                "function_parameters": "self",
            },
            {
                "function_name": "no_params",
                "function_parameters": "",
            },
        ])
    })
})


test('py.getFunctionLinks', () => {
    const fileName = 'test.py'
    const code = `
        import os
        import sys, json
        from collections import defaultdict, Counter
        from mymodule import myfunc

        def add(a, b):
            os.something()
            return a + b

        def subtract(a, b):
            defaultdict()
            return a - b

        class MyClass:
            def my_method(self):
                Counter()
                add()
                pass

        def no_params():
            myfunc()
            pass
    `

    const res = py.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-add": new Set([
            "Lib-os",
        ]),
        "test-subtract": new Set([
            "collections-defaultdict",
        ]),
        "test-my_method": new Set([
            "collections-Counter",
            "test-add",
        ]),
        "test-no_params": new Set([
            "mymodule-myfunc",
        ]),
    }
    )
})
