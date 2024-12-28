export declare const invisibleValues: Set<string>;
/**
 * Returns a function that, when provided a progress value between 0 and 1,
 * will return the "none" or "hidden" string only when the progress is that of
 * the origin or target.
 */
export declare function mixVisibility(origin: string, target: string): (p: number) => string;
