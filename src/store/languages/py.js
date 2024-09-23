/*
const code = `
import os
import sys
from datetime import datetime, timedelta
from collections import namedtuple as nt
`
*/

export const getImportDefinition = (file_name, code) => {
  const importRegex = /(?:import\s+([\w.,\s]+))|(?:from\s+([\w.]+)\s+import\s+([\w.,\s]+))/g

  const imports = {};
  let match;

  // matches[match.groups.namespace] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
  while ((match = importRegex.exec(code)) !== null) {
    if (match[1]) {
      // For 'import module'

      match[1].split(',').map(mod => mod.trim()).forEach(f => {
        imports[f] = { 'function_called_in': file_name, 'function_defined_in': 'Lib' }
      })

    } else if (match[2] && match[3]) {
      // For 'from module import elements'

      match[3].split(',').map(element => element.trim()).forEach(f => {
        imports[f] = { 'function_called_in': file_name, 'function_defined_in': match[2] }
      })

    }
  }

  return imports
}

/*
const code = `
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

class MyClass:
    def my_method(self):
        pass

def no_params():
    pass
`;
*/
// matches[match[2]] = { 'file_name': file_name, 'function_parameters': match[3] }
/*
export const getFunctionDefinition = (file_name, code) => {
  const functions = {};
  let match;

  const functionRegex = /def\s+(\w+)\s*\(([^)]*)\)\s*:/g

  while ((match = functionRegex.exec(code)) !== null) {
    const functionName = match[1]; // Function name
    const parameters = match[2] ? match[2].split(',').map(param => param.trim()) : []; // Function parameters

    functions[functionName] = { 'file_name': file_name, 'function_parameters': parameters }
  }

  return functions
}
*/

export const getFileToFunctions = (file_name, code) => {
  const matches = {};
  let match;

  const regex = /def\s+(\w+)\s*\(([^)]*)\)\s*:/g

  while ((match = regex.exec(code)) !== null) {
    const functionName = match[1]; // Function name
    const parameters = match[2] || ''; // Function parameters

    if (file_name in matches) {
      matches[file_name].add(`${functionName}(${parameters}`)
    }

  }

  return matches;
}


const getFunctionsDefined = (code) => {
  const functions = []
  let match;

  const functionRegex = /def\s+(\w+)\s*\(([^)]*)\)\s*:/g

  while ((match = functionRegex.exec(code)) !== null) {
    const functionName = match[1]; // Function name
    const parameters = match[2] ? match[2].split(',').map(param => param.trim()) : []; // Function parameters

    functions.push(functionName)
  }

  return functions
}

const getFunctionsImported = (code) => {
  const importRegex = /(?:import\s+([\w.,\s]+))|(?:from\s+([\w.]+)\s+import\s+([\w.,\s]+))/g

  const imports = []
  let match;

  // matches[match.groups.namespace] = { 'function_called_in': file_name, 'function_defined_in': match.groups.module }
  while ((match = importRegex.exec(code)) !== null) {
    if (match[1]) {
      // For 'import module'

      match[1].split(',').map(mod => mod.trim()).forEach(f => {
        imports.push(f)
      })

    } else if (match[2] && match[3]) {
      // For 'from module import elements'

      match[3].split(',').map(element => element.trim()).forEach(f => {
        imports.push(f)
      })

    }
  }

  return imports
}

/*
const code = `
def add(a, b):
    return a + b

def subtract(a, b):
    result = a - b
    return result

class MyClass:
    def my_method(self):
        print("Hello from method")

def no_params():
    pass
`;
*/
export const getFunctionLinks = (file_name, code) => {
    const functionRegex = /def\s+(\w+)\s*\([^)]*\)\s*:(\n\s+[^\n]+)*/g

    const functionLinks = []
    let match

    const functions_defined = getFunctionsDefined(code)
    const functions_imported = getFunctionsImported(code)

    while ((match = functionRegex.exec(code)) !== null) {
        [...functions_defined, ...functions_imported].forEach((f) => {
            if (match[0].includes(f)) {
                const endIndex = match.index + match[0].length
                const functionName = match[1]
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
