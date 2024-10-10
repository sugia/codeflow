/*
        import UIKit
        import Foundation
        import MyCustomFramework
*/

export const getImportDefinition = (file_name, code) => {
    const importRegex = /import\s+([\w.]+)/g

    const matches = {}
    let match

    const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))
    // function_name: 
    while ((match = importRegex.exec(code)) !== null) {
        //console.log(match)
        if (match[1]) {
            const vec = match[1].split('.')
            let function_name = vec[vec.length - 1]

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

            if (vec.length > 1) {
                file_key_source = vec[vec.length - 2]
                function_key = file_key_source + '-' + function_name

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
    }

    return matches
}

/*
        func sayHello(name: String) {
            print("Hello, \\(name)")
        }
        
        func add(a: Int, b: Int) -> Int {
            return a + b
        }
        
        func noParams() -> String {
            return "This function has no parameters"
        }
*/
export const getFileToFunctions = (file_name, code) => {
    const matches = {}
    let match

    const regex = /func\s+(\w+)\(([\w:\s,]*)\)\s*(->)?\s*(\w*)\s*{/g

    if (!(file_name in matches)) {
        matches[file_name] = new Set()
    }

    while ((match = regex.exec(code)) !== null) {
        if (match[1]) {
            matches[file_name].add(
                {
                    'function_name': match[1],
                    'function_parameters': match[2] || '',
                    'return_type': match[4] || null,
                }
            )
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
    const functionRegex = /func\s+(\w+)\(([\w:\s,]*)\)\s*(->)?\s*(\w*)\s*{/g

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
