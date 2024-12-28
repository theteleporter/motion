import { Color } from "../value-types/types";
export declare const mixLinearColor: (from: number, to: number, v: number) => number;
export declare const mixColor: (from: Color | string, to: Color | string) => (p: number) => string | Color;
