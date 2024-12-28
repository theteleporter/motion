import { EasingFunction } from "./easing/types";
type Mix<T> = (v: number) => T;
export type MixerFactory<T> = (from: T, to: T) => Mix<T>;
export interface InterpolateOptions<T> {
    clamp?: boolean;
    ease?: EasingFunction | EasingFunction[];
    mixer?: MixerFactory<T>;
}
/**
 * Create a function that maps from a numerical input array to a generic output array.
 *
 * Accepts:
 *   - Numbers
 *   - Colors (hex, hsl, hsla, rgb, rgba)
 *   - Complex (combinations of one or more numbers or strings)
 *
 * ```jsx
 * const mixColor = interpolate([0, 1], ['#fff', '#000'])
 *
 * mixColor(0.5) // 'rgba(128, 128, 128, 1)'
 * ```
 *
 * TODO Revist this approach once we've moved to data models for values,
 * probably not needed to pregenerate mixer functions.
 *
 * @public
 */
export declare function interpolate<T>(input: number[], output: T[], { clamp: isClamp, ease, mixer }?: InterpolateOptions<T>): (v: number) => T;
export {};
