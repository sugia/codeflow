

export const getImportDefinition = (file_name, code) => {
    const importRegex = /import\s+(?:(?<default>\w+)\s*,?\s*)?(?:\{(?<named>[\w\s,]*)\}\s*,?\s*)?(?:\*\s+as\s+(?<namespace>\w+)\s*,?\s*)?from\s+['"`](?<module>.+?)['"`];?/g;

    const matches = {};
    let match;

    const file_key = file_name.slice(0, file_name.lastIndexOf('.'))
    // function_name: 
    while ((match = importRegex.exec(code)) !== null) {
        if (match.groups.namespace) {
            const key = match.groups.module.slice(match.groups.module.lastIndexOf('/') + 1) + '-' + match.groups.namespace

            if (key in matches) {
                matches[key].add(file_key)
            } else {
                matches[key] = new Set([file_key])
            }
        }

        if (match.groups.default) {
            const key = match.groups.module.slice(match.groups.module.lastIndexOf('/') + 1) + '-' + match.groups.default
            if (key in matches) {
                matches[key].add(file_key)
            } else {
                matches[key] = new Set([file_key])
            }
        }

        if (match.groups.named) {
            match.groups.named.split(',').map(i => i.trim()).filter(Boolean).forEach((item) => {
                const key = match.groups.module.slice(match.groups.module.lastIndexOf('/') + 1) + '-' + item
                if (key in matches) {
                    matches[key].add(file_key)
                } else {
                    matches[key] = new Set([file_key])
                }
            })
        }
    }

    return matches;
}


// Combine the regex for function declarations, function expressions, and arrow functions
/*
export const getFunctionDefinition = (file_name, code) => {
    const matches = {};
    let match;

    const regex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g

    while ((match = regex.exec(code)) !== null) {
        if (match[2]) {
            // Function Declaration
            matches[match[2]] = { 'file_name': file_name, 'function_parameters': match[3] }
            // matches.push({ type: file_name, name: match[2], params: match[3] });
        } else if (match[5]) {
            // Function Expression
            matches[match[5]] = { 'file_name': file_name, 'function_parameters': match[6] }
            // matches.push({ type: file_name, name: match[5], params: match[6] });
        } else if (match[8]) {
            // Arrow Function
            matches[match[8]] = { 'file_name': file_name, 'function_parameters': match[9] }
            // matches.push({ type: file_name, name: match[8], params: match[9] });
        }
    }

    return matches;
}
*/

export const getFileToFunctions = (file_name, code) => {
    const matches = {};
    let match;

    const regex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g

    while ((match = regex.exec(code)) !== null) {
        /*
        if (match[2]) {
            if (file_key in matches) {
                matches[file_key].add(`${match[2]}(${match[3]})`)
            } else {
                matches[file_key] = new Set([`${match[2]}(${match[3]})`])
            }
        } else if (match[5]) {
            if (file_key in matches) {
                matches[file_key].add(`${match[5]}(${match[6]})`)
            } else {
                matches[file_key] = new Set([`${match[5]}(${match[6]})`])
            }
        } else if (match[8]) {
            if (file_key in matches) {
                matches[file_key].add(`${match[8]}(${match[9]})`)
            } else {
                matches[file_key] = new Set([`${match[8]}(${match[9]})`])
            }
        }
        */
        if (match[2]) {
            if (file_name in matches) {
                matches[file_name].add({ 'function_name': match[2], 'function_parameters': match[3] })
            } else {
                matches[file_name] = new Set([{ 'function_name': match[2], 'function_parameters': match[3] }])
            }
        } else if (match[5]) {
            if (file_name in matches) {
                matches[file_name].add({ 'function_name': match[5], 'function_parameters': match[6] })
            } else {
                matches[file_name] = new Set([{ 'function_name': match[5], 'function_parameters': match[6] }])
            }
        } else if (match[8]) {
            if (file_name in matches) {
                matches[file_name].add({ 'function_name': match[8], 'function_parameters': match[9] })
            } else {
                matches[file_name] = new Set([{ 'function_name': match[8], 'function_parameters': match[9] }])
            }
        }
    }

    return matches;
}




const getFunctionsDefined = (file_name, code) => {
    const matches = []
    let match
    const file_key = file_name.slice(0, file_name.lastIndexOf('.'))
    const regex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g

    while ((match = regex.exec(code)) !== null) {

        if (match[2]) {
            // Function Declaration
            let item = {
                'file_key': file_key,
                'function_name': match[2],
            }
            matches.push(item)
        } else if (match[5]) {
            // Function Expression
            let item = {
                'file_key': file_key,
                'function_name': match[5],
            }
            matches.push(item)
        } else if (match[8]) {
            // Arrow Function
            let item = {
                'file_key': file_key,
                'function_name': match[8],
            }
            matches.push(item)
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
const getFunctionsImported = (code) => {
    const regex = /import\s+(?:(?<default>\w+)\s*,?\s*)?(?:\{(?<named>[\w\s,]*)\}\s*,?\s*)?(?:\*\s+as\s+(?<namespace>\w+)\s*,?\s*)?from\s+['"`](?<module>.+?)['"`];?/g

    const matches = []
    let match

    // function_name: 
    while ((match = regex.exec(code)) !== null) {

        if (match.groups.namespace) {
            let item = {
                'file_key': match.groups.module.slice(match.groups.module.lastIndexOf('/') + 1),
                'function_name': match.groups.namespace,
            }
            matches.push(item)
        }

        if (match.groups.default) {
            let item = {
                'file_key': match.groups.module.slice(match.groups.module.lastIndexOf('/') + 1),
                'function_name': match.groups.default,
            }
            matches.push(item)
        }

        if (match.groups.named) {

            match.groups.named.split(',').map(i => i.trim()).filter(Boolean).forEach((named) => {
                let item = {
                    'file_key': match.groups.module.slice(match.groups.module.lastIndexOf('/') + 1),
                    'function_name': named,
                }
                matches.push(item)
            })
        }
    }

    return matches
}


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

    let openBraces = 1;
    let closeBraces = 0;
    let index = match.index + def.length;

    // Loop through the code starting after the match to count braces
    while (index < code.length && openBraces !== closeBraces) {
        if (code[index] === '{') {
            openBraces++;
        } else if (code[index] === '}') {
            closeBraces++;
        }
        index++;
    }

    if (openBraces === closeBraces) {
        return code.substring(match.index, index); // Return the full function
    }
    return ''; // No matching closing brace found

}

export const getFunctionLinks = (file_name, code) => {
    const functionRegex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g

    const functionLinks = {}
    let match

    const file_key = file_name.slice(0, file_name.lastIndexOf('.'))

    const functions_defined = getFunctionsDefined(file_name, code)
    const functions_imported = getFunctionsImported(code)

    while ((match = functionRegex.exec(code)) !== null) {
        let functionName
        let tmp

        if (match[2]) {
            functionName = match[2]
            tmp = getWholeFunction(match, match[2], code)
        } else if (match[5]) {
            functionName = match[5]
            tmp = getWholeFunction(match, match[5], code)
        } else if (match[8]) {
            functionName = match[8]
            tmp = getWholeFunction(match, match[8], code)
        }




        if (functionName && tmp) {
            [...functions_defined, ...functions_imported].forEach((item) => {
                
                // console.log(item)

                if (tmp.includes(item.function_name) && functionName !== item.function_name) {
                    if (functionName in functionLinks) {
                        functionLinks[file_key + '-' + functionName].add(item.file_key + '-' + item.function_name)
                    } else {
                        functionLinks[file_key + '-' + functionName] = new Set([item.file_key + '-' + item.function_name])
                    }

                }
            })
        }
    }

    // console.log('functionLinks', functionLinks)
    return functionLinks
}
