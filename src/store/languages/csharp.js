export const getImportDefinition = (file_name, code) => {
    const regex_with_alias = /using\s*(static)?\s*([\w]+\s*=\s*)\s*([\w.*]+);/g
    const regex_without_alias = /using\s*(static)?\s*([\w.*]+);/g

    const matches = {}
    let match

    const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))

    while ((match = regex_with_alias.exec(code)) !== null) {
        if (match[3]) {
            const last_dot_index = match[3].lastIndexOf('.')
            const last_second_dot_index = match[3].lastIndexOf('.', last_dot_index - 1)

            const function_name = match[3].slice(last_dot_index + 1)
            let function_file = match[3].slice(last_second_dot_index + 1, last_dot_index)
            if (last_dot_index === -1) {
                function_file = match[3].slice(last_second_dot_index + 1)
            }
            let function_key = function_file + '-' + function_name

            const function_alias = match[2].slice(0, match[2].indexOf(' '))

            if(!(function_key in matches)) {
                matches[function_key] = new Set([])
            }

            matches[function_key].add(
                {
                    'file_key_source': function_file,
                    'file_key_target': file_key_target,
                    'function_name': function_name,
                    'function_alias': function_alias,
                }
            )

            if (function_name !== '*' && function_name !== function_file) {
                // file-file
                function_key = function_name + '-' + function_name
                if (!(function_key in matches)) {
                    matches[function_key] = new Set([])
                }

                matches[function_key].add(
                    {
                        'file_key_source': function_name,
                        'file_key_target': file_key_target,
                        'function_name': function_name,
                        'function_alias': function_alias,
                    }
                )
            }
        }
    }
    
    // function_name: 
    while ((match = regex_without_alias.exec(code)) !== null) {

        if (match[2]) {
            const last_dot_index = match[2].lastIndexOf('.')
            const last_second_dot_index = match[2].lastIndexOf('.', last_dot_index - 1)

            //console.log(last_dot_index, last_second_dot_index)

            const function_name = match[2].slice(last_dot_index + 1)
            
            let function_file = match[2].slice(last_second_dot_index + 1, last_dot_index)
            if (last_dot_index === -1) {
                function_file = match[2].slice(last_second_dot_index + 1)
            }
            let function_key =  function_file + '-' + function_name

            if (!(function_key in matches)) {
                matches[function_key] = new Set([])
            }

            matches[function_key].add(
                {
                    'file_key_source': function_file,
                    'file_key_target': file_key_target,
                    'function_name': function_name,
                }
            )

            if (function_name !== '*' && function_name !== function_file) {
                // file-file
                function_key = function_name + '-' + function_name
                if (!(function_key in matches)) {
                    matches[function_key] = new Set([])
                }

                matches[function_key].add(
                    {
                        'file_key_source': function_name,
                        'file_key_target': file_key_target,
                        'function_name': function_name,
                    }
                )
            }
        }
    }

    return matches
}


export const getFileToFunctions = (file_name, code) => {
    const matches = {};
    let match;

    const regex = /(public|private|protected)?\s*(static)?\s*(\w+)\s*(\w+)\(([\w\s,]*)\)\s*\{/g

    if (!(file_name in matches)) {
        matches[file_name] = new Set([])
    }
    while ((match = regex.exec(code)) !== null) {
        if (match[4]) {
            matches[file_name].add(
                {
                    'function_name': match[4],
                    'function_parameters': match[5],
                    'return_type': match[3],
                }
            )
        }
    }
    // get class names
    const classRegex = /class\s+([\w]+)\s*\{/g
    while ((match = classRegex.exec(code)) !== null) {
        if (match[1]) {
            matches[file_name].add(
                {
                    'function_name': match[1],
                    'function_parameters': '',
                    'return_type': 'class',
                }
            )
        }
    }

    return matches;
}


/*
const jsCode = `
  import React from 'react';
  import { useState, useEffect } from 'react';
  import * as Utils from './utils';
  import './styles.css';
  import defaultExport, { namedExport1, namedExport2 } from './module';
`
 */

/*
function add(a, b) {
  if (a > b) {
    return a;
  } else {
   if (1 < 2) {
    return 1
   } else {
    if (2 < 3) {
        return 2
    } else {
        return 3 
    }
   }
    return b;
  }
}

const multiply = (x, y) => {
  return x * y;
}

const subtract = function(a, b) {
  return a - b;
};
*/

const getWholeFunction = (match, def, code) => {
    // console.log(match.index, def.length)
    if (!match) {
        return ''; // No match for function declaration
    }

    let openBraces = 0
    let closeBraces = 0
    let index = match.index

    while (index < code.length && code[index] !== '{') {
        index++
    }
    index++
    openBraces++
    // Loop through the code starting after the match to count braces
    while (index < code.length && openBraces !== closeBraces) {
        //console.log(code[index])
        if (code[index] === '{') {
            openBraces++;
        } else if (code[index] === '}') {
            closeBraces++;
        }
        index++
    }
    //console.log(openBraces, closeBraces)
    if (openBraces === closeBraces) {
        return code.substring(match.index, index) // Return the full function
    }
    return ''; // No matching closing brace found

}

export const getFunctionLinks = (file_name, code) => {
    const functionRegex = /(public|private|protected)?\s*(static)?\s*(\w+)\s*(\w+)\(([\w\s,]*)\)\s*\{/g

    const functionLinks = {}
    let match


    while ((match = functionRegex.exec(code)) !== null) {
        let functionName
        let tmp


        //console.log('~~~~~~~~~~')
        if (match[4]) {
            functionName = match[4]
            tmp = getWholeFunction(match, match[4], code)
        }


        const file_key = file_name.slice(0, file_name.lastIndexOf('.'))


        // console.log(functions_imported)
        // console.log(functionName, tmp)

        if (functionName && tmp) {
            const functions_defined = getFileToFunctions(file_name, code)

            Object.keys(functions_defined).forEach((fn) => {
                functions_defined[fn].forEach((item) => {
                    if ((tmp.includes(item.function_name + '.') ||
                        tmp.includes(item.function_name + '!.') ||
                        tmp.includes(item.function_name + '?.') ||
                        tmp.includes(item.function_name + '(') ||
                        tmp.includes(item.function_name + '[')
                    ) && functionName !== item.function_name) {
                        const functionNameKey = file_key + '-' + functionName
                        if (functionNameKey in functionLinks) {
                            functionLinks[functionNameKey].add(file_key + '-' + item.function_name)
                        } else {
                            functionLinks[functionNameKey] = new Set([file_key + '-' + item.function_name])
                        }
                    }
                })
            })

            const functions_imported = getImportDefinition(file_name, code)

            Object.keys(functions_imported).forEach((function_key) => {
                Array.from(functions_imported[function_key]).forEach((item) => {
                    let match_key = item.function_name
                    if (item.function_alias) {
                        match_key = item.function_alias
                    }
                    if ((tmp.includes(match_key + '.') ||
                        tmp.includes(match_key + '!.') ||
                        tmp.includes(match_key + '?.') ||
                        tmp.includes(match_key + '(') ||
                        tmp.includes(match_key + '[')
                    ) && functionName !== item.function_name) {
                        const functionNameKey = file_key + '-' + functionName
                        if (functionNameKey in functionLinks) {
                            functionLinks[functionNameKey].add(
                                item.file_key_source + '-' + item.function_name
                            )
                        } else {
                            functionLinks[functionNameKey] = new Set([
                                item.file_key_source + '-' + item.function_name
                            ])
                        }
                    }
                })
            })
        }
    }

    // console.log('functionLinks', functionLinks)
    return functionLinks
}
