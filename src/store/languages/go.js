export const getImportDefinition = (file_name, code) => {

    const matches = {}
    let match

    const file_key_target = file_name.slice(0, file_name.lastIndexOf('.'))


    const regex_without_bracket = /import\s*([\w_.]*)\s*\"(.*)\"/g
    while ((match = regex_without_bracket.exec(code)) !== null) {
        const file_key_source = match[2].slice(match[2].lastIndexOf('/') + 1)
        const function_key = file_key_source + '-' + file_key_source

        if (!(function_key in matches)) {
            matches[function_key] = new Set([])
        }
        let item = {
            'file_key_source': file_key_source,
            'file_key_target': file_key_target,
            'function_name': file_key_source,
        }
        if (match[1]) {
            item['function_alias'] = match[1]
        }
        matches[function_key].add(item)
    }

    const regex_with_bracket = /import\s*\(\s*(([\w_.]*)\s*\"(.*)\"\s*)+\)/g
    while ((match = regex_with_bracket.exec(code)) !== null) {
        match[0].split('\n').map(i => i.trim()).filter(Boolean).forEach((row) => {
            if (row.includes('import')) {
                return
            }
            let function_name = ''
            let function_alias = null

            if (row.includes(' ')) {
                const tmp = row.split(' ').map(i => i.trim()).filter(Boolean)

                function_name = tmp[1].replace(/"/g, '')
                function_name = function_name.slice(function_name.lastIndexOf('/') + 1)
                function_alias = tmp[0]

            } else {
                function_name = row.replace(/"/g, '')
                function_name = function_name.slice(function_name.lastIndexOf('/') + 1)
            }

            const file_key_source = function_name
            if (file_key_source === ')') {
                return
            }
            const function_key = function_name + '-' + function_name

            if (!(function_key in matches)) {
                matches[function_key] = new Set([])
            }
            let item = {
                'file_key_source': file_key_source,
                'file_key_target': file_key_target,
                'function_name': function_name,
            }
            if (function_alias) {
                item['function_alias'] = function_alias
            }
            matches[function_key].add(item)
        })
    }


    return matches
}


export const getFileToFunctions = (file_name, code) => {
    const matches = {}
    let match;

    const regex = /.*/g

    while ((match = regex.exec(code)) !== null) {

    }


    return matches
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
    const functionRegex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g

    const functionLinks = {}
    let match


    while ((match = functionRegex.exec(code)) !== null) {
        let functionName
        let tmp


        //console.log('~~~~~~~~~~')
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


        const file_key = file_name.slice(0, file_name.lastIndexOf('.'))


        //console.log(functions_imported)
        //console.log(functionName, tmp)

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
