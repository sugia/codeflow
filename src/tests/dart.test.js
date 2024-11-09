import * as dart from '../store/languages/dart'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('dart.getImportDefinition', () => {
    const fileName = 'test.dart'
    const code = `
        import 'package:flutter/material.dart';
        import 'dart:math';
        import 'package:my_package/utils.dart' as utils;
        import 'package:my_package/feature.dart' deferred as feature;
        import 'package:platform/platform.dart' if (dart.library.io) 'package:platform_io/platform_io.dart';

        import 'dart:io';
        import 'package:http/http.dart' as http;
    `
    const res = dart.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "package:flutter-material": new Set([
            { "file_key_source": "package:flutter", "file_key_target": "test", "function_name": "material", "function_alias": undefined }
        ]),
        "dart-math": new Set([
            { "file_key_source": "dart", "file_key_target": "test", "function_name": "math", "function_alias": undefined }
        ]),
        "package:my_package-utils": new Set([
            { "file_key_source": "package:my_package", "file_key_target": "test", "function_name": "utils", "function_alias": "utils" }
        ]),
        "package:my_package-feature": new Set([
            { "file_key_source": "package:my_package", "file_key_target": "test", "function_name": "feature", "function_alias": "feature" }
        ]),
        "package:platform-platform": new Set([
            { "file_key_source": "package:platform", "file_key_target": "test", "function_name": "platform", "function_alias": undefined }
        ]),
        "package:platform_io-platform_io": new Set([
            { "file_key_source": "package:platform_io", "file_key_target": "test", "function_name": "platform_io", "function_alias": undefined }
        ]),
        "dart-io": new Set([
            { "file_key_source": "dart", "file_key_target": "test", "function_name": "io", "function_alias": undefined }
        ]),
        "package:http-http": new Set([
            { "file_key_source": "package:http", "file_key_target": "test", "function_name": "http", "function_alias": "http" }
        ]),
    })
})

test('dart.getFileToFunctions', () => {
    const fileName = 'test.dart'
    const code = `
        void sayHello(String name) {
        print("Hello, \$name");
        }

        int sum(int a, int b) => a + b;

        class Calculator {
            double divide(double a, double b) {
                return a / b;
            }

            bool isEven(int number) => number % 2 == 0;
        }
    `

    const res = dart.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.dart": new Set([
            {
                "function_name": "sayHello",
                "function_parameters": "String name",
                "return_type": "void",
            },
            {
                "function_name": "sum",
                "function_parameters": "int a, int b",
                "return_type": "int",
            },
            {
                "function_name": "divide",
                "function_parameters": "double a, double b",
                "return_type": "double",
            },
            {
                "function_name": "isEven",
                "function_parameters": "int number",
                "return_type": "bool",
            },
            {
                "function_name": "Calculator",
                "function_parameters": "",
                "return_type": "class",
            },
        ])
    })
})


test('dart.getFunctionLinks', () => {
    const fileName = 'test.dart'
    const code = `
        import 'package:flutter/material.dart';
        import 'dart:math';
        import 'package:my_package/utils.dart' as utils;
        import 'package:my_package/feature.dart' deferred as feature;
        import 'package:platform/platform.dart' if (dart.library.io) 'package:platform_io/platform_io.dart';

        import 'dart:io';
        import 'package:http/http.dart' as http;


        void sayHello(String name) {
            utils.call()
            print("Hello, \$name");
        }

        int sum(int a, int b) => a + b;

        class Calculator {
            double divide(double a, double b) {
                math.cos()
                return a / b;
            }

            bool isEven(int number) => number % 2 == 0;
        }
    `

    const res = dart.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-sayHello": new Set([
            "package:my_package-utils",
        ]),
        "test-divide": new Set([
            "dart-math",
        ]),
    }
    )
})
