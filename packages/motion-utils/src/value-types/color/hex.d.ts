import { RGBA } from "../types";
declare function parseHex(v: string): RGBA;
export declare const hex: {
    test: (v: any) => boolean;
    parse: typeof parseHex;
    transform: ({ red, green, blue, alpha }: RGBA) => string;
};
export {};
