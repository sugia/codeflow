import * as rust from '../store/languages/rust'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('rust.getImportDefinition', () => {
    const fileName = 'test.rs'
    const code = `
        use std::io;
        use std::collections::HashMap as Map;
        use std::io::{self, Write};
        use crate::my_module;
    `
    const res = rust.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "std-io": new Set([
            { "file_key_source": "std", "file_key_target": "test", "function_name": "io" }
        ]),
        "collections-HashMap": new Set([
            { "file_key_source": "collections", "file_key_target": "test", "function_name": "HashMap", "function_alias": "Map" }
        ]),
        "io-self": new Set([
            { "file_key_source": "io", "file_key_target": "test", "function_name": "self" }
        ]),
        "io-Write": new Set([
            { "file_key_source": "io", "file_key_target": "test", "function_name": "Write" }
        ]),
        "create-my_module": new Set([
            { "file_key_source": "create", "file_key_target": "test", "function_name": "my_module" }
        ]),
    })
})

test('rust.getFileToFunctions', () => {
    const fileName = 'test.rs'
    const code = `
        fn add(a: i32, b: i32) -> i32 {
            a + b
        }

        fn print_hello() {
            println!("Hello, world!");
        }

        fn divide(a: f64, b: f64) -> Result<f64, String> {
            if b == 0.0 {
                return Err("Cannot divide by zero".to_string());
            }
            Ok(a / b)
        }

        fn get_array() -> [i32; 3] {
            [1, 2, 3]
        }
    `

    const res = rust.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.rs": new Set([
            {
                "function_name": "add",
                "function_parameters": "a: i32, b: i32",
                "return_type": "i32",
            },
            {
                "function_name": "print_hello",
                "function_parameters": "",
                "return_type": null,
            },
            {
                "function_name": "divide",
                "function_parameters": "a: f64, b: f64",
                "return_type": "Result<f64, String>",
            },
            {
                "function_name": "get_array",
                "function_parameters": "",
                "return_type": "[i32; 3]",
            },
        ])
    })
})


test('rust.getFunctionLinks', () => {
    const fileName = 'test.rs'
    const code = `
        use std::io;
        use std::collections::HashMap as Map;
        use std::io::{self, Write};
        use crate::my_module;

        fn add(a: i32, b: i32) -> i32 {
            io()
            a + b
        }

        fn print_hello() {
            Map()
            println!("Hello, world!");
        }

        fn divide(a: f64, b: f64) -> Result<f64, String> {
            Write()
            if b == 0.0 {
                return Err("Cannot divide by zero".to_string());
            }
            Ok(a / b)
        }

        fn get_array() -> [i32; 3] {
            my_module()
            [1, 2, 3]
        }
    `

    const res = rust.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-add": new Set([
            "std-io",
        ]),
        "test-print_hello": new Set([
            "collections-HashMap",
        ]),
        "test-divide": new Set([
            "io-Write",
        ]),
        "test-get_array": new Set([
            "create-my_module",
        ]),
    }
    )
})
