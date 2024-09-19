export const reducer = (state, action) => {
    const { type, value } = action
    switch (type) {
        default:
            return { ...state, ...value }
    }
}
