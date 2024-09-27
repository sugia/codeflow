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
    const res = csharp.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "System-System": new Set([
            { "file_key_source": "System", "file_key_target": "test", "function_name": "System" }
        ]),
        "Collections-Generic": new Set([
            { "file_key_source": "Collections", "file_key_target": "test", "function_name": "Generic" }
        ]),
        "System-Math": new Set([
            { "file_key_source": "System", "file_key_target": "test", "function_name": "Math" }
        ]),
        "MyProject-Namespace": new Set([
            { "file_key_source": "MyProject", "file_key_target": "test", "function_name": "Namespace", "function_alias": "ProjectName" }
        ]),
        "MyNamespace-MyType": new Set([
            { "file_key_source": "MyNamespace", "file_key_target": "test", "function_name": "MyType", "function_alias": "MyAlias" }
        ]),
        "Generic-Generic": new Set([
            { "file_key_source": "Generic", "file_key_target": "test", "function_name": "Generic" }
        ]),
        "Math-Math": new Set([
            { "file_key_source": "Math", "file_key_target": "test", "function_name": "Math" }
        ]),
        "MyType-MyType": new Set([
            { "file_key_source": "MyType", "file_key_target": "test", "function_name": "MyType", "function_alias": "MyAlias" }
        ]),
        "Namespace-Namespace": new Set([
            { "file_key_source": "Namespace", "file_key_target": "test", "function_name": "Namespace", "function_alias": "ProjectName" }
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
        "test.cs": new Set([
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
            {
                "function_name": "Example",
                "function_parameters": "",
                "return_type": "class",
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
                MyAlias()
            }
        }
    `

    const res = csharp.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-Add": new Set([
            "Collections-Generic",
            "Generic-Generic",
        ]),
        "test-Greet": new Set([
            "System-Math",
            "Math-Math",
        ]),
        "test-DoSomething": new Set([
            "MyNamespace-MyType",
            "MyType-MyType",
        ]),
    }
    )
})
