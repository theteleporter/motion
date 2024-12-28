export declare const number: {
    test: (v: number) => boolean;
    parse: typeof parseFloat;
    transform: (v: number) => number;
};
export declare const alpha: {
    transform: (v: number) => number;
    test: (v: number) => boolean;
    parse: typeof parseFloat;
};
export declare const scale: {
    default: number;
    test: (v: number) => boolean;
    parse: typeof parseFloat;
    transform: (v: number) => number;
};
