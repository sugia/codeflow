import * as go from '../store/languages/go'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('go.getImportDefinition', () => {
    const fileName = 'test.go'
    const code = `
        import (
            x "fmt"
            "bytes"
        )

        import "something/random"

        import dg "github.com/bwmarrin/discordgo"

        import (
            crand "crypto/rand"
        )

        import (
            . "math"
        )

        import (
            "database/sql"
            _ "github.com/go-sql-driver/mysql"
        )
    `
    const res = go.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "fmt-fmt": new Set([
            { "file_key_source": "fmt", "file_key_target": "test", "function_name": "fmt", "function_alias": "x" }
        ]),
        "bytes-bytes": new Set([
            { "file_key_source": "bytes", "file_key_target": "test", "function_name": "bytes" }
        ]),
        "random-random": new Set([
            { "file_key_source": "random", "file_key_target": "test", "function_name": "random" }
        ]),
        "discordgo-discordgo": new Set([
            { "file_key_source": "discordgo", "file_key_target": "test", "function_name": "discordgo", "function_alias": "dg" }
        ]),
        "rand-rand": new Set([
            { "file_key_source": "rand", "file_key_target": "test", "function_name": "rand", "function_alias": "crand" }
        ]),
        "math-math": new Set([
            { "file_key_source": "math", "file_key_target": "test", "function_name": "math", "function_alias": "." }
        ]),
        "sql-sql": new Set([
            { "file_key_source": "sql", "file_key_target": "test", "function_name": "sql" }
        ]),
        "mysql-mysql": new Set([
            { "file_key_source": "mysql", "file_key_target": "test", "function_name": "mysql", "function_alias": "_" }
        ]),
    })
})

test('go.getFileToFunctions', () => {
    const fileName = 'test.go'
    const code = `
        func add(a int, b int) int {
            return a + b
        }

        // Method with receiver
        func (r *Receiver) multiply(x int, y int) int {
            return x * y
        }

        // Function without return
        func sayHello(name string) {
            fmt.Println("Hello", name)
        }
    `

    const res = go.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.go": new Set([
            {
                "function_name": "add",
                "function_parameters": "a int, b int",
                "return_type": "int",
            },
            {
                "function_name": "multiply",
                "function_parameters": "r *Receiver",
                "return_type": "int",
            },
            {
                "function_name": "sayHello",
                "function_parameters": "name string",
                "return_type": null,
            },
        ])
    })
})


test('go.getFunctionLinks', () => {
    const fileName = 'test.go'
    const code = `
        import (
            x "fmt"
            "bytes"
        )

        import dg "github.com/bwmarrin/discordgo"

        import (
            crand "crypto/rand"
        )

        import (
            . "math"
            "fmt"
        )

        import (
            "database/sql"
            _ "github.com/go-sql-driver/mysql"
        )

        func add(a int, b int) int {
            fmt.println("add")
            return a + b
        }

        // Method with receiver
        func (r *Receiver) multiply(x int, y int) int {
            crand()
            return x * y
        }

        // Function without return
        func sayHello(name string) {
            sql.updateHelloTimestamp()
            fmt.Println("Hello", name)
        }
    `

    const res = go.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-add": new Set([
            "fmt-fmt",
        ]),
        "test-multiply": new Set([
            "rand-rand",
        ]),
        "test-sayHello": new Set([
            "sql-sql",
        ]),
    }
    )
})
