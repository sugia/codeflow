
const importRegex = /import\s+(?:(?<default>\w+)\s*,?\s*)?(?:\{(?<named>[\w\s,]*)\}\s*,?\s*)?(?:\*\s+as\s+(?<namespace>\w+)\s*,?\s*)?from\s+['"`](?<module>.+?)['"`];?/g;

export const getImportDefinition = (file_name, code) => {
    const matches = {};
    let match;

    // function_name: 
    while ((match = importRegex.exec(code)) !== null) {
        if (match.groups.namespace) {
            matches[match.groups.namespace] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
        }

        if (match.groups.default) {
            matches[match.groups.default] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
        }

        if (match.groups.named) {
            match.groups.named.split(',').map(i => i.trim()).filter(Boolean).forEach((item) => {
                matches[item] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
            })
        }
    }

    return matches;
}


// Combine the regex for function declarations, function expressions, and arrow functions
const combinedFunctionRegex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g;

export const getFunctionDefinition = (file_name, code) => {
    const matches = {};
    let match;

    const regex = combinedFunctionRegex

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


export const getFileToFunctions = (file_name, code) => {
    const matches = {};
    let match;

    const regex = combinedFunctionRegex

    while ((match = regex.exec(code)) !== null) {
        if (match[2]) {
            if (file_name in matches) {
                matches[file_name].add(`${match[2]}(${match[3]})`)
            } else {
                matches[file_name] = new Set([`${match[2]}(${match[3]})`])
            }
        } else if (match[5]) {
            if (file_name in matches) {
                matches[file_name].add(`${match[5]}(${match[6]})`)
            } else {
                matches[file_name] = new Set([`${match[5]}(${match[6]})`])
            }
        } else if (match[8]) {
            if (file_name in matches) {
                matches[file_name].add(`${match[8]}(${match[9]})`)
            } else {
                matches[file_name] = new Set([`${match[8]}(${match[9]})`])
            }
        }
    }

    return matches;
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
const getFunctionsDefined = (code) => {
    const matches = []
    let match

    const regex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g;

    while ((match = regex.exec(code)) !== null) {
        // console.log(match)
        if (match[2]) {
            // Function Declaration
            matches.push(match[2])
        } else if (match[5]) {
            // Function Expression
            matches.push(match[5])
        } else if (match[8]) {
            // Arrow Function
            matches.push(match[8])
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
            matches.push(match.groups.namespace)
        }

        if (match.groups.default) {
            matches.push(match.groups.default)
        }

        if (match.groups.named) {

            match.groups.named.split(',').map(i => i.trim()).filter(Boolean).forEach((item) => {
                matches.push(item)
            })
        }
    }

    return matches
}

export const getFunctionLinks = (code) => {
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\}|\w+\s*=\s*\(([^)]*)\)\s*=>\s*\{[\s\S]*?\}|const\s+(\w+)\s*=\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}/g

    const functionLinks = []
    let match

    const functions_defined = getFunctionsDefined(code)
    const functions_imported = getFunctionsImported(code)

    while ((match = functionRegex.exec(code)) !== null) {
        [...functions_defined, ...functions_imported].forEach((f) => {
            if (match[0].includes(f)) {
                const endIndex = match.index + match[0].length
                const functionName = match[1] || match[3] || code.slice(match.index, endIndex).match(/\w+(?=\s*=\s*function)/)?.[0]
                if (functionName && functionName != f) {
                    functionLinks.push({
                        'source': f,
                        'target': functionName,
                    })
                }
            }
        })
    }

    // console.log('functionLinks', functionLinks)
    return functionLinks
}
