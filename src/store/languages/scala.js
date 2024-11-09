export const getImportDefinition = (file_name, code) => {
    const regex_normal = /import\s+([\w\.]+)\s*\n/g

    const matches = {}
    let match


    const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))


    // function_name: 
    while ((match = regex_normal.exec(code)) !== null) {
        //console.log(match)
        if (match[1]) {
            const last_dot_index = match[1].lastIndexOf('.')
            

            let function_name = match[1].slice(last_dot_index + 1)
            let file_key_source = match[1].slice(0, last_dot_index)
            let function_key = file_key_source + '-' + function_name


            if (!(function_key in matches)) {
                matches[function_key] = new Set()
            }

            matches[function_key].add(
                {
                    'file_key_source': file_key_source,
                    'file_key_target': file_key_target,
                    'function_name': function_name,
                    'function_alias': undefined,
                }
            )
        }

    }

    const regex_multiple = /import\s+([\w\.]+){([\w,\s=>]+)}/g


    while ((match = regex_multiple.exec(code)) !== null) {
        if (match[2]) {
            const vec = match[2].split(',')

            let file_key_source = match[1].slice(0, match[1].length - 1)
            let function_name
            let function_alias
            let function_key

            vec.forEach(item => {
                let item_trimmed = item.trim()
                if (item_trimmed.includes('=>')) {
                    const tmp = item_trimmed.split('=>')
                    function_name = tmp[0].trim()
                    function_alias = tmp[1].trim()
                    function_key = file_key_source + '-' + function_name
                } else {
                    function_name = item_trimmed
                    function_alias = undefined
                    function_key = file_key_source + '-' + function_name
                }
    
    
                if (!(function_key in matches)) {
                    matches[function_key] = new Set()
                }
    
                matches[function_key].add(
                    {
                        'file_key_source': file_key_source,
                        'file_key_target': file_key_target,
                        'function_name': function_name,
                        'function_alias': function_alias,
                    }
                )
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
    const matches = {}
    let match

    const regex = /def\s+(\w+)\(([\w\s:,]*)\):\s*(\w+)/g

    while ((match = regex.exec(code)) !== null) {
        if (match[1]) {
            if (file_name in matches) {
                matches[file_name].add(
                    {
                        'function_name': match[1],
                        'function_parameters': match[2] || '',
                        'return_type': match[3],
                    }
                )
            } else {
                matches[file_name] = new Set([
                    {
                        'function_name': match[1],
                        'function_parameters': match[2] || '',
                        'return_type': match[3],
                    }
                ])
            }
        }
    }

    const regex_val = /val\s+(\w+)\s*=\s*\(([\w\s:,]+)\)/g
    while ((match = regex_val.exec(code)) !== null) {
        if (match[1]) {
            if (file_name in matches) {
                matches[file_name].add(
                    {
                        'function_name': match[1],
                        'function_parameters': match[2] || '',
                        'return_type': "",
                    }
                )
            } else {
                matches[file_name] = new Set([
                    {
                        'function_name': match[1],
                        'function_parameters': match[2] || '',
                        'return_type': "",
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
    const functionRegex = /def\s+(\w+)\(([\w\s:,]*)\):\s*(\w+)/g

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
