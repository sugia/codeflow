export const reducer = (state, action) => {
    const { value } = action

    /*
    console.log('~~~~~~~~~~')
    console.log(
        Object.keys(state.file_definition).length,
        Object.keys(state.import_definition).length,
        Object.keys(state.function_definition).length,
        Object.keys(state.file_to_functions).length,
        state.function_links.length)

    console.log(
        Object.keys(value.file_definition || {}).length,
        Object.keys(value.import_definition || {}).length,
        Object.keys(value.function_definition || {}).length,
        Object.keys(value.file_to_functions || {}).length,
        (value.function_links || []).length)
    */
    return { ...state, ...value }

}
