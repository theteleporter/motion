import { CSSVariableToken } from "../../is-css-variable";
import { Color } from "../types";
declare function test(v: any): boolean;
export type ComplexValues = Array<CSSVariableToken | string | number | Color>;
export type ValueIndexes = {
    color: number[];
    number: number[];
    var: number[];
};
export interface ComplexValueInfo {
    values: ComplexValues;
    split: string[];
    indexes: ValueIndexes;
    types: Array<keyof ValueIndexes>;
}
export declare function analyseComplexValue(value: string | number): ComplexValueInfo;
declare function parseComplexValue(v: string | number): ComplexValues;
declare function createTransformer(source: string | number): (v: Array<CSSVariableToken | Color | number | string>) => string;
declare function getAnimatableNone(v: string | number): string;
export declare const complex: {
    test: typeof test;
    parse: typeof parseComplexValue;
    createTransformer: typeof createTransformer;
    getAnimatableNone: typeof getAnimatableNone;
};
export {};
