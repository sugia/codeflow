import * as javascript from './languages/javascript'
import * as python from './languages/python'
import * as go from './languages/go'
import * as rust from './languages/rust'
import * as java from './languages/java'
import * as csharp from './languages/csharp'

import * as php from './languages/php'
import * as ruby from './languages/ruby'

import * as swift from './languages/swift'
import * as kotlin from './languages/kotlin'

import * as cpp from './languages/cpp'

import * as lua from './languages/lua'

import * as dart from './languages/dart'

import * as scala from './languages/scala'

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

    '.php': php,
    '.rb': ruby,  // todo: function match prefix, example: utils matches another_utils

    '.swift': swift, // todo: import local file
    '.kt': kotlin,  // todo: function match prefix, example: List matches ArrayList
    '.kts': kotlin,

    '.c': cpp, // todo: import local file
    '.cpp': cpp, // todo: import local file

    '.lua': lua, // similar to ruby in code structure and function definition

    '.dart': dart, // similar to csharp + javascript

    '.scala': scala, // todo: getFunctinLinks to add more conditions
}

/*
export const languageMap = {



    '.pl': 'Perl',
    '.pm': 'Perl Modules',

    '.erl': 'Erlang',
    '.hrl': 'Erlang Header File',
}
*/



/*
perl

use strict;
use warnings;
use List::Util qw(max min);
require JSON if \$ENV{USE_JSON};
use v5.10;



sub greet {
    print "Hello, World!\\n";
}

sub add {
    my (\$a, \$b) = \@_;
    return \$a + \$b;
}

my \$multiply = sub {
    my (\$x, \$y) = \@_;
    return \$x * \$y;
};

sub square { \$_[0] ** 2 }

*/


/*
-module(my_module).
-import(lists, [map/2, foldl/3]).
-import(io, [format/2]).
-export([my_function/1]).
-import(math, [sin/1, cos/1]).


-module(example).
-export([hello/0, add/2, factorial/1]).

hello() -> "Hello, World!".

add(A, B) -> A + B.

factorial(0) -> 1;
factorial(N) -> N * factorial(N - 1).

square(X) -> X * X.

Fun = fun(X) -> X * X end.
*/