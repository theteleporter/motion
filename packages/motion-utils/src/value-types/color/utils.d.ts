import { Color, HSLA, RGBA } from "../types";
/**
 * Returns true if the provided string is a color, ie rgba(0,0,0,0) or #000,
 * but false if a number or multiple colors
 */
export declare const isColorString: (type: string, testProp?: string) => (v: any) => boolean;
export declare const splitColor: <V extends RGBA | HSLA>(aName: string, bName: string, cName: string) => (v: string | Color) => V;
