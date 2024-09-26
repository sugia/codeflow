import * as java from '../store/languages/java'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('java.getImportDefinition', () => {
    const fileName = 'test.java'
    const code = `
        import java.util.List;
        import static java.lang.Math.PI;
        import java.util.*;
        import com.example.MyClass;
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

test('java.getFileToFunctions', () => {
    const fileName = 'test.java'
    const code = `
        public class Example {
            public int add(int a, int b) {
                return a + b;
            }

            private static String greet(String name) {
                return "Hello, " + name;
            }

            void doSomething() {
                System.out.println("Doing something...");
            }
        }
    `

    const res = java.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.java": new Set([
            {
                "function_name": "add",
                "function_parameters": "int a, int b",
                "return_type": "int",
            },
            {
                "function_name": "greet",
                "function_parameters": "String name",
                "return_type": "String",
            },
            {
                "function_name": "doSomething",
                "function_parameters": "self",
                "return_type": "void",
            },
        ])
    })
})


test('java.getFunctionLinks', () => {
    const fileName = 'test.java'
    const code = `
        import java.util.List;
        import static java.lang.Math.PI;
        import java.util.*;
        import com.example.MyClass;

        public class Example {
            public int add(int a, int b) {
                List()
                return a + b;
            }

            private static String greet(String name) {
                PI()
                return "Hello, " + name;
            }

            void doSomething() {
                MyClass()
                System.out.println("Doing something...");
            }
        }
    `

    const res = py.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-add": new Set([
            "util-List",
        ]),
        "test-greet": new Set([
            "Math-PI",
        ]),
        "test-doSomething": new Set([
            "example-MyClass",
        ]),
    }
    )
})
