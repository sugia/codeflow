import * as javascript from './languages/javascript'
import * as python from './languages/python'
import * as go from './languages/go'
import * as rust from './languages/rust'
import * as java from './languages/java'
import * as csharp from './languages/csharp'

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
    '.js': javascript,
    '.jsx': javascript,
    '.ts': javascript,
    '.tsx': javascript,

    '.py': python,


    '.go': go, // todo: files in the same package can call each other's functions without explicitly importing each other

    //todo regular expressions
    '.rs': rust,
    '.java': java, // todo: import local file

    '.cs': csharp, // todo: import local file
}

/*
export const languageMap = {
     '.cpp': 'C++',
    '.c': 'C',


    '.php': 'PHP',

    '.rb': 'Ruby',

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
}
*/
