import * as scala from '../store/languages/scala'

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('scala.getImportDefinition', () => {
    const fileName = 'test.scala'
    const code = `
        import scala.collection.mutable
        import scala.util.{Try, Success, Failure}
        import java.util._
        import java.sql.{Date => SQLDate}
    `
    const res = scala.getImportDefinition(fileName, code)

    expect(res).toEqual({
        "scala.collection-mutable": new Set([
            { "file_key_source": "scala.collection", "file_key_target": "test", "function_name": "mutable", "function_alias": undefined }
        ]),
        "scala.util-Try": new Set([
            { "file_key_source": "scala.util", "file_key_target": "test", "function_name": "Try", "function_alias": undefined }
        ]),
        "scala.util-Success": new Set([
            { "file_key_source": "scala.util", "file_key_target": "test", "function_name": "Success", "function_alias": undefined }
        ]),
        "scala.util-Failure": new Set([
            { "file_key_source": "scala.util", "file_key_target": "test", "function_name": "Failure", "function_alias": undefined }
        ]),
        "java.util-_": new Set([
            { "file_key_source": "java.util", "file_key_target": "test", "function_name": "_", "function_alias": undefined }
        ]),
        "java.sql-Date": new Set([
            { "file_key_source": "java.sql", "file_key_target": "test", "function_name": "Date", "function_alias": "SQLDate" }
        ]),
    })
})

test('scala.getFileToFunctions', () => {
    const fileName = 'test.scala'
    const code = `
        def greet(name: String): Unit = {
            println(s"Hello, $name!")
        }

        def sum(a: Int, b: Int): Int = a + b

        val multiply = (x: Int, y: Int) => x * y

        def show(): Unit = println("Showing data")

        def multiply(a: Int, b: Int): Int = a * b
        def multiply(a: Double, b: Double): Double = a * b
    `

    const res = scala.getFileToFunctions(fileName, code)

    expect(res).toEqual({
        "test.scala": new Set([
            {
                "function_name": "greet",
                "function_parameters": "name: String",
                "return_type": "Unit",
            },
            {
                "function_name": "sum",
                "function_parameters": "a: Int, b: Int",
                "return_type": "Int",
            },
            {
                "function_name": "multiply",
                "function_parameters": "x: Int, y: Int",
                "return_type": "",
            },
            {
                "function_name": "show",
                "function_parameters": "",
                "return_type": "Unit",
            },
            {
                "function_name": "multiply",
                "function_parameters": "a: Int, b: Int",
                "return_type": "Int",
            },
            {
                "function_name": "multiply",
                "function_parameters": "a: Double, b: Double",
                "return_type": "Double",
            },
        ])
    })
})


test('scala.getFunctionLinks', () => {
    const fileName = 'test.scala'
    const code = `
        import scala.collection.mutable
        import scala.util.{Try, Success, Failure}
        import java.util._
        import java.sql.{Date => SQLDate}


        def greet(name: String): Unit = {
            SQLDate.call()
            Try.it()
            mutable.run()
            println(s"Hello, $name!")
        }

        def sum(a: Int, b: Int): Int = a + b

        val multiply = (x: Int, y: Int) => x * y

        def show(): Unit = println("Showing data")

        def multiply(a: Int, b: Int): Int = a * b
        def multiply(a: Double, b: Double): Double = a * b
    `

    const res = scala.getFunctionLinks(fileName, code)

    expect(res).toEqual({
        "test-greet": new Set([
            "java.sql-Date",
            "scala.util-Try",
            "scala.collection-mutable",
        ]),
    }
    )
})
