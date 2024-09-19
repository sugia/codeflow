python
cpp
java
c
csharp
javascript
typescript
    React
golang
php
ruby
rust
swift
kotlin
Lua
Dart
Scala
Perl
Erlang

// file definition, 1 unique row of file_name
[
    'file_name',
    'programming_language',
]

// function definition, 1 unique row of function_name
[
    'function_name',
    'file_name',
    'function_parameters',
    'function_start_row',
    'function_start_column',
    'function_end_row',
    'function_end_column',
]

// file to functions
{
    'file_name': {
        'function_name',
        'function_name',
    }
}

// function call, 0~+00 rows of function_name
[
    'function_name',
    'original_function_name',
    'original_file_name',
    
    'function_start_row',
    'function_start_column',
    'function_end_row',
    'function_end_column',
]