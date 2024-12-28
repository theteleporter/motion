import { Mixer } from "./types";
export declare function mix<T>(from: T, to: T): Mixer<T>;
export declare function mix(from: number, to: number, p: number): number;
