import * as js from './languages/js'
import * as py from './languages/py'

/*
    getImportDefinition(file_name, code)
    // ? getFunctionDefinition(file_name, code)
    getFileToFunctions(file_name, code)
    getFunctionLinks(code)
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
    '.py': 'Python',
    '.cpp': 'C++',
    '.java': 'Java',
    '.c': 'C',
    '.cs': 'C#',

    '.js': js,
    '.jsx': js,
    '.ts': js,
    '.tsx': js,

    '.go': 'Golang',
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