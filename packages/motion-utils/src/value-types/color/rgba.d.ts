import { RGBA } from "../types";
export declare const rgbUnit: {
    transform: (v: number) => number;
    test: (v: number) => boolean;
    parse: typeof parseFloat;
};
export declare const rgba: {
    test: (v: any) => boolean;
    parse: (v: string | import("../types").Color) => RGBA;
    transform: ({ red, green, blue, alpha }: RGBA) => string;
};
