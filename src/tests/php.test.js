import * as php from '../store/languages/php'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('php.getImportDefinition', () => {
    const fileName = 'test.php'
    const code = `
        <?php
            // This is a simple PHP script

            require_once 'config.php'; // Load configuration
            include 'header.php'; // Include the header
            require 'utils.php'; // Load utility functions
            include_once 'footer.php'; // Include footer only once

            // Rest of the PHP code
            function doSomething() {
                // Some logic here
            }
        ?>
    `
    const res = php.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "config-config": new Set([
            { "file_key_source": "config", "file_key_target": "test", "function_name": "config" }
        ]),
        "header-header": new Set([
            { "file_key_source": "header", "file_key_target": "test", "function_name": "header" }
        ]),
        "utils-utils": new Set([
            { "file_key_source": "utils", "file_key_target": "test", "function_name": "utils" }
        ]),
        "footer-footer": new Set([
            { "file_key_source": "footer", "file_key_target": "test", "function_name": "footer" }
        ]),
    })
})

test('php.getFileToFunctions', () => {
    const fileName = 'test.php'
    const code = `
        <?php
            // Sample PHP functions

            function sayHello($name) {
                echo "Hello " . $name;
            }

            function add($a, $b) {
                return $a + $b;
            }

            function noParams() {
                return "No parameters";
            }
        ?>
    `

    const res = php.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.php": new Set([
            {
                "function_name": "sayHello",
                "function_parameters": "$name",
            },
            {
                "function_name": "add",
                "function_parameters": "$a, $b",
            },
            {
                "function_name": "noParams",
                "function_parameters": "",
            },
        ])
    })
})


test('php.getFunctionLinks', () => {
    const fileName = 'test.php'
    const code = `
        <?php
            // This is a simple PHP script

            require_once 'config.php'; // Load configuration
            include 'header.php'; // Include the header
            require 'utils.php'; // Load utility functions
            include_once 'footer.php'; // Include footer only once

            // Rest of the PHP code
            function doSomething() {
                // Some logic here
            }

            // Sample PHP functions

            function sayHello($name) {
                utils.call()
                echo "Hello " . $name;
            }

            function add($a, $b) {
                utils.add()
                return $a + $b;
            }

            function noParams() {
                return "No parameters";
            }
        ?>
    `

    const res = php.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-sayHello": new Set([
            "utils-utils",
        ]),
        "test-add": new Set([
            "utils-utils",
        ]),
    }
    )
})
