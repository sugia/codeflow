import * as cpp from '../store/languages/cpp'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('cpp.getImportDefinition', () => {
    const fileName = 'test.cpp'
    const code = `
        #include <iostream>
        #include <vector>
        #include <stdio.h>
        #include <stdlib.h>
        #include "myheader.h"
        #include "utils/helper.hpp"
    `
    const res = cpp.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "System-iostream": new Set([
            { "file_key_source": "System", "file_key_target": "test", "function_name": "iostream" }
        ]),
        "System-vector": new Set([
            { "file_key_source": "System", "file_key_target": "test", "function_name": "vector" }
        ]),
        "System-stdio": new Set([
            { "file_key_source": "System", "file_key_target": "test", "function_name": "stdio" }
        ]),
        "System-stdlib": new Set([
            { "file_key_source": "System", "file_key_target": "test", "function_name": "stdlib" }
        ]),
        "myheader-myheader": new Set([
            { "file_key_source": "myheader", "file_key_target": "test", "function_name": "myheader" }
        ]),
        "utils-helper": new Set([
            { "file_key_source": "utils", "file_key_target": "test", "function_name": "helper" }
        ]),
    })
})

test('cpp.getFileToFunctions', () => {
    const fileName = 'test.cpp'
    const code = `
        void printHello() {
            std::cout << "Hello, World!" << std::endl;
        }

        int add(int a, int b) {
            return a + b;
        }

        double multiply(double x, double y) {
            return x * y;
        }
    `

    const res = cpp.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.cpp": new Set([
            {
                "function_name": "printHello",
                "function_parameters": "",
                "return_type": "void",
            },
            {
                "function_name": "add",
                "function_parameters": "int a, int b",
                "return_type": "int",
            },
            {
                "function_name": "multiply",
                "function_parameters": "double x, double y",
                "return_type": "double",
            },
        ])
    })
})


test('cpp.getFunctionLinks', () => {
    const fileName = 'test.cpp'
    const code = `
        #include <iostream>
        #include <vector>
        #include <stdio.h>
        #include <stdlib.h>
        #include "myheader.h"
        #include "utils/helper.hpp"

        void printHello() {
            helper.function()
            std::cout << "Hello, World!" << std::endl;
        }

        int add(int a, int b) {
            myheader.function()
            return a + b;
        }

        double multiply(double x, double y) {
            vector()
            return x * y;
        }
    `

    const res = cpp.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-printHello": new Set([
            "utils-helper",
        ]),
        "test-add": new Set([
            "myheader-myheader",
        ]),
        "test-multiply": new Set([
            "System-vector",
        ]),
    }
    )
})
