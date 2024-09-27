export const getImportDefinition = (file_name, code) => {
    const regex = /use\s*([\w.*:\{\},\s]+);/g

    const matches = {}
    let match

    const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))

    while ((match = regex.exec(code)) !== null) {
        if (match[1]) {
            const vec = match[1].split("::")
            if (vec[vec.length-1].includes('{') && vec[vec.length-1].includes('}')) {

                vec[vec.length-1].replace(/[\{|\}]/g, '').split(',').map(i => i.trim()).filter(Boolean).forEach((named) => {
                    let function_name = named
                    let function_alias = null
                    if (function_name.includes(" as ")) {
                        const tmp = function_name.split(" as ")
                        function_name = tmp[0].trim()
                        function_alias = tmp[1].trim()
                    }
                    let function_file = function_name
                    if (vec.length >= 2) {
                        function_file = vec[vec.length-2]
                    }

                    const function_key = function_file + '-' + function_name

                    if(!(function_key in matches)) {
                        matches[function_key] = new Set([])
                    }

                    let item = {
                        'file_key_source': function_file,
                        'file_key_target': file_key_target,
                        'function_name': function_name,
                    }
                    if (function_alias) {
                        item['function_alias'] = function_alias
                    }
                    matches[function_key].add(item)

                })
            } else {
                let function_name = vec[vec.length-1]
                let function_alias = null
                if (function_name.includes(" as ")) {
                    const tmp = function_name.split(" as ")
                    function_name = tmp[0].trim()
                    function_alias = tmp[1].trim()
                }
                let function_file = function_name
                if (vec.length >= 2) {
                    function_file = vec[vec.length-2]
                }

                const function_key = function_file + '-' + function_name

                if(!(function_key in matches)) {
                    matches[function_key] = new Set([])
                }

                let item = {
                    'file_key_source': function_file,
                    'file_key_target': file_key_target,
                    'function_name': function_name,
                }
                if (function_alias) {
                    item['function_alias'] = function_alias
                }
                matches[function_key].add(item)            
            }
        }
    }

    return matches
}


export const getFileToFunctions = (file_name, code) => {
    const matches = {};
    let match;

    const regex = /fn\s+(\w+)\(([\w:\s,]*)\)\s*(->)?\s*([\w<,\s>\[\];]*)\s+\{/g

    if (!(file_name in matches)) {
        matches[file_name] = new Set([])
    }
    while ((match = regex.exec(code)) !== null) {
        if (match[1]) {
            matches[file_name].add(
                {
                    'function_name': match[1],
                    'function_parameters': match[2],
                    'return_type': match[4] || null,
                }
            )
        }
    }

    return matches
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
    const functionRegex = /fn\s+(\w+)\(([\w:\s,]*)\)\s*(->)?\s*([\w<,\s>\[\];]*)\s+\{/g

    const functionLinks = {}
    let match


    while ((match = functionRegex.exec(code)) !== null) {
        let functionName
        let tmp


        //console.log('~~~~~~~~~~')
        if (match[1]) {
            functionName = match[1]
            tmp = getWholeFunction(match, match[1], code)
        }


        const file_key = file_name.slice(0, file_name.lastIndexOf('.'))


        // console.log(functions_imported)
        // console.log(functionName, tmp)

        if (functionName && tmp) {
            const functions_defined = getFileToFunctions(file_name, code)

            Object.keys(functions_defined).forEach((fn) => {
                functions_defined[fn].forEach((item) => {
                    let match_key = item.function_name
                    if (item.function_alias) {
                        match_key = item.function_alias
                    }
                    if ((tmp.includes(match_key + '.') ||
                        tmp.includes(match_key + '!.') ||
                        tmp.includes(match_key + '?.') ||
                        tmp.includes(match_key + '(') ||
                        tmp.includes(match_key + '[') ||
                        tmp.includes(match_key + '::')
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
                        tmp.includes(match_key + '[') ||
                        tmp.includes(match_key + '::')
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
