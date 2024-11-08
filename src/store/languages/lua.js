export const getImportDefinition = (file_name, code) => {

    const matches = {}
    let match


    const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))

    const regex_require = /require\s*\(?['"]([\w\/]+)['"]\)?/g

    // function_name: 
    while ((match = regex_require.exec(code)) !== null) {
        //console.log(match)
        if (match[1]) {
            let function_name = match[1]
            let file_key_source = function_name
            let function_key = file_key_source + '-' + function_name


            if (!(function_key in matches)) {
                matches[function_key] = new Set()
            }

            matches[function_key].add(
                {
                    'file_key_source': file_key_source,
                    'file_key_target': file_key_target,
                    'function_name': function_name,
                }
            )
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

    const regex = /function\s+(\w*:)?(\w+)\(?([\w,\s]*)\)?\n/g

    while ((match = regex.exec(code)) !== null) {
        if (match[2]) {
            if (file_name in matches) {
                matches[file_name].add(
                    {
                        'function_name': match[2],
                        'function_parameters': match[3] || '',
                    }
                )
            } else {
                matches[file_name] = new Set([
                    {
                        'function_name': match[2],
                        'function_parameters': match[3] || '',
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
    let endIndex = code.indexOf('end', match.index)
    
    if (endIndex !== -1) {
        return code.substring(match.index, endIndex + 3) // Return the full function
    }
    return ''; // No matching closing brace found

}

export const getFunctionLinks = (file_name, code) => {
    const functionRegex = /function\s+(\w*:)?(\w+)\(?([\w,\s]*)\)?\n/g

    const functionLinks = {}
    let match


    while ((match = functionRegex.exec(code)) !== null) {
        let functionName
        let tmp

        if (match[2]) {
            functionName = match[2]
            tmp = getWholeFunction(match, match[2], code)
            console.log(functionName, tmp)

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
