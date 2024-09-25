/*
import os
import sys, json
from collections import defaultdict, Counter
from mymodule import myfunc
*/

export const getImportDefinition = (file_name, code) => {
  const importRegex = /from\s(.+)\s+import\s+(.+)|import\s+(.+)/g

  const matches = {}
  let match

  const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))
  // function_name: 
  while ((match = importRegex.exec(code)) !== null) {
    //console.log(match)
    if (match[1] && match[2]) {
      const file_key_source = match[1].trim()
      match[2].split(',').map(i => i.trim()).filter(Boolean).forEach((named) => {
        const function_key = file_key_source + '-' + named
        if (function_key in matches) {
          matches[function_key].add(
            {
              'file_key_source': file_key_source,
              'file_key_target': file_key_target,
              'function_name': named,
            }
          )
        } else {
          matches[function_key] = new Set([
            {
              'file_key_source': file_key_source,
              'file_key_target': file_key_target,
              'function_name': named,
            }
          ])
        }
      })
    } else if (match[3]) {
      match[3].split(',').map(i => i.trim()).filter(Boolean).forEach((named) => {
        const function_key = 'Lib' + '-' + named
        if (function_key in matches) {
          matches[function_key].add(
            {
              'file_key_source': 'Lib',
              'file_key_target': file_key_target,
              'function_name': named,
            }
          )
        } else {
          matches[function_key] = new Set([
            {
              'file_key_source': 'Lib',
              'file_key_target': file_key_target,
              'function_name': named,
            }
          ])
        }
      })
    }
  }

  return matches
}

/*
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

class MyClass:
    def my_method(self):
        pass

def no_params():
    pass
*/
export const getFileToFunctions = (file_name, code) => {
  const matches = {};
  let match;

  const regex = /def\s+(.+)\((.*)\):/g

  while ((match = regex.exec(code)) !== null) {
    if (match[1]) {
      if (file_name in matches) {
        matches[file_name].add(
          {
            'function_name': match[1],
            'function_parameters': match[2] || '',
          }
        )
      } else {
        matches[file_name] = new Set([
          {
            'function_name': match[1],
            'function_parameters': match[2] || '',
          }
        ])
      }
    }
  }

  return matches;
}



const getWholeFunction = (match, def, code) => {
  // console.log(match.index, def.length)
  if (!match) {
      return ''; // No match for function declaration
  }

  
  let preDefStart = match.index
  while (0 <= preDefStart - 1 && (code[preDefStart - 1] === ' ' || code[preDefStart - 1] === '\t')) {
    preDefStart--
  }

  //console.log('[' + code.substring(preDefStart, match.index) + ']')
  let index = match.index
  while (index < code.length) {
    let tmpLeft = code.indexOf('\n', index)
    if (tmpLeft === -1) {
      break
    }

    tmpLeft++
    let tmpRight = tmpLeft
    while (tmpRight < code.length && (code[tmpRight] === ' ' || code[tmpRight] === '\t')) {
      tmpRight++
    }

    //console.log('{' + code.substring(tmpLeft, tmpRight) + '}')

    if (tmpRight - tmpLeft === match.index - preDefStart || tmpLeft === tmpRight) {
      return code.substring(match.index, tmpLeft)
    }

    index = tmpRight + 1
  }
  
  return code.substring(match.index)
}


export const getFunctionLinks = (file_name, code) => {
  const functionRegex = /def\s+(.+)\((.*)\):/g

  const functionLinks = {}
  let match


  while ((match = functionRegex.exec(code)) !== null) {
      let functionName
      let tmp

      if (match[1]) {
        functionName = match[1]
        tmp = getWholeFunction(match, match[1], code)
        // console.log(functionName, tmp)
      }


      const file_key = file_name.slice(0, file_name.lastIndexOf('.'))


      if (functionName && tmp) {
          const functions_defined = getFileToFunctions(file_name, code)

          Object.keys(functions_defined).forEach((fn) => {
              functions_defined[fn].forEach((item) => {
                  if (tmp.includes(item.function_name) && functionName !== item.function_name) {
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
                  if (tmp.includes(item.function_name) && functionName !== item.function_name) {
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
