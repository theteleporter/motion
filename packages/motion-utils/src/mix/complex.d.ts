import { HSLA, RGBA } from "../value-types/types";
type MixableArray = Array<number | RGBA | HSLA | string>;
type MixableObject = {
    [key: string]: string | number | RGBA | HSLA;
};
export declare function getMixer<T>(a: T): ((from: string | import("../value-types/types").Color, to: string | import("../value-types/types").Color) => (p: number) => string | import("../value-types/types").Color) | ((origin: string | number, target: string | number) => Function) | typeof mixArray | typeof mixObject;
export declare function mixArray(a: MixableArray, b: MixableArray): (p: number) => (string | number | RGBA | HSLA)[];
export declare function mixObject(a: MixableObject, b: MixableObject): (v: number) => {
    [x: string]: string | number | RGBA | HSLA;
};
export declare const mixComplex: (origin: string | number, target: string | number) => Function;
export {};
