/**
 * Pipe
 * Compose other transformers to run linearily
 * pipe(min(20), max(40))
 * @param  {...functions} transformers
 * @return {function}
 */
const combineFunctions = (a, b) => (v) => b(a(v));
export const pipe = (...transformers) => transformers.reduce(combineFunctions);
//# sourceMappingURL=pipe.js.map