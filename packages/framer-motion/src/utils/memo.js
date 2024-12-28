export function memo(callback) {
    let result;
    return () => {
        if (result === undefined)
            result = callback();
        return result;
    };
}
//# sourceMappingURL=memo.js.map