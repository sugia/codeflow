import * as csharp from '../store/languages/csharp'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('csharp.getImportDefinition', () => {
    const fileName = 'test.cs'
    const code = `
        using System;
        using System.Collections.Generic;
        using static System.Math;
        using ProjectName = MyProject.Namespace;
        using MyAlias = MyNamespace.MyType;
    `
    const res = py.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "util-List": new Set([
            { "file_key_source": "util", "file_key_target": "test", "function_name": "List" }
        ]),
        "Math-PI": new Set([
            { "file_key_source": "Math", "file_key_target": "test", "function_name": "PI" }
        ]),
        "util-*": new Set([
            { "file_key_source": "util", "file_key_target": "test", "function_name": "*" }
        ]),
        "example-MyClass": new Set([
            { "file_key_source": "example", "file_key_target": "test", "function_name": "MyClass" }
        ]),
    })
})

test('csharp.getFileToFunctions', () => {
    const fileName = 'test.cs'
    const code = `
        public class Example {
            public int Add(int a, int b) {
                return a + b;
            }

            private static void Greet(string name) {
                Console.WriteLine("Hello, " + name);
            }

            protected virtual void DoSomething() {
                // Method body
            }
        }
    `

    const res = csharp.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.csharp": new Set([
            {
                "function_name": "Add",
                "function_parameters": "int a, int b",
                "return_type": "int",
            },
            {
                "function_name": "Greet",
                "function_parameters": "string name",
                "return_type": "void",
            },
            {
                "function_name": "DoSomething",
                "function_parameters": "",
                "return_type": "void",
            },
        ])
    })
})


test('csharp.getFunctionLinks', () => {
    const fileName = 'test.cs'
    const code = `
        using System;
        using System.Collections.Generic;
        using static System.Math;
        using ProjectName = MyProject.Namespace;
        using MyAlias = MyNamespace.MyType;

        public class Example {
            public int Add(int a, int b) {
                Generic()
                return a + b;
            }

            private static void Greet(string name) {
                Math()
                Console.WriteLine("Hello, " + name);
            }

            protected virtual void DoSomething() {
                // Method body
                MyType()
            }
        }
    `

    const res = py.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-Add": new Set([
            "Collections-Generic",
        ]),
        "test-Greet": new Set([
            "System-Math",
        ]),
        "test-DoSomething": new Set([
            "MyNamespace-MyType",
        ]),
    }
    )
})
