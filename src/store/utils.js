import * as js from './languages/js'
import * as py from './languages/py'

/*
    getImportDefinition(file_name, code)
    return {
        // file_key = file_name without suffix
        // function_key = file_key + '-' + function_name
        [function_key]: new Set([
            {
                'file_key_source': file_key defined,
                'file_key_target': file_key called,
                'function_name': function_name without parameters,
            }
        ])
    }

    getFileToFunctions(file_name, code)
    return {
        // file_name has suffix
        [file_name]: new Set([
            { 
                'function_name': function name, 
                'function_parameters': function parameters, 
            }
        ])
    }

    getFunctionLinks(file_name, code)
    return {
        // file_key = file_name without suffix
        // function_key = file_key + '-' + function_name
        [function_key]: new Set([
            function_key
        ])
    }
*/

export const languageMap = {
    '.js': js,
    '.jsx': js,
    '.ts': js,
    '.tsx': js,

    '.py': py,
}
/*
export const languageMap = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React),

    '.py': 'Python',


    '.go': 'Golang',

    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',

    '.php': 'PHP',

    '.rb': 'Ruby',
    '.rs': 'Rust',

    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.kts': 'Kotlin scripts',

    '.lua': 'Lua',
    '.dart': 'Dart',
    '.scala': 'Scala',

    '.pl': 'Perl',
    '.pm': 'Perl Modules',

    '.erl': 'Erlang',
    '.hrl': 'Erlang Header File',

    '.html': 'HTML',
    '.css': 'CSS',
    '.json': 'JSON',
    '.md': 'Markdown',
    // Add more extensions and languages as needed
}
*/
