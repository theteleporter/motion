import {
    invariant,
    millisecondsToSeconds,
    noop,
    secondsToMilliseconds,
} from "motion-utils"
import { supportsLinearEasing } from "../utils/supports/linear-easing"
import { createGeneratorEasing } from "./generators/utils/create-generator-easing"
import { isGenerator } from "./generators/utils/is-generator"
import { hydrateKeyframes } from "./keyframes/hydrate"
import {
    AnimationPlaybackControls,
    DOMValueAnimationOptions,
    GeneratorFactory,
    ProgressTimeline,
    ValueAnimationTransition,
    ValueKeyframe,
} from "./types"

const defaultEasing = "easeOut"
const defaultDuration = 300

export interface NativeAnimationOptions<V extends string | number = number>
    extends DOMValueAnimationOptions<V> {
    pseudoElement?: string
}

/**
 * NativeAnimation implements AnimationPlaybackControls for the browser's Web Animations API.
 */
export class NativeAnimation implements AnimationPlaybackControls {
    /**
     * The interfaced Web Animation API animation
     */
    private animation: Animation

    private allowFlatten: boolean

    constructor({
        element,
        name,
        keyframes,
        pseudoElement,
        transition,
        allowFlatten = false,
    }: NativeAnimationOptions) {
        invariant(
            typeof transition.type !== "string",
            `animateMini doesn't support "type" as a string. Did you mean to import { spring } from "motion"?`
        )

        this.allowFlatten = allowFlatten

        /**
         * TODO: Handle existing animations on the element. We want to run this
         * here so if we need to read from the element then the value is
         * already rendered.
         */

        /**
         * TODO: If these keyframes aren't correctly hydrated then we want to throw
         * run an instant animation.
         */
        if (!Array.isArray(keyframes)) {
            keyframes = [keyframes]
        }
        hydrateKeyframes(element, name, keyframes, pseudoElement)

        if (isGenerator(transition.type)) {
            transition = this.handleGenerator(transition, keyframes)
        }

        // TODO: Create animation
    }

    /**
     * Convert the generator into a JS easing function. In a later step
     * this JS easing function will be converted into a linear() easing
     * function along with those defined by the user.
     *
     * This method is written to be inherited by NativeAnimationExtended,
     * which will also offer the ability to run the generator with keyframes
     * and velocity.
     */
    private handleGenerator(
        transition: ValueAnimationTransition,
        _keyframes: ValueKeyframe[]
    ): ValueAnimationTransition {
        const generatorOptions = createGeneratorEasing(
            transition,
            100,
            transition.type as GeneratorFactory
        )

        return {
            ...transition,
            type: "keyframes",
            ease: supportsLinearEasing()
                ? generatorOptions.ease
                : defaultEasing,
            duration: secondsToMilliseconds(generatorOptions.duration),
        }
    }

    play() {
        this.animation.play()
    }

    pause() {
        this.animation.pause()
    }

    complete() {
        this.animation.finish()
    }

    cancel() {
        try {
            this.animation.cancel()
        } catch (e) {}
    }

    stop() {
        const { state } = this

        if (state === "idle" || state === "finished") {
            return
        }

        this.commitStyles()

        this.cancel()
    }

    /**
     * WAAPI doesn't natively have any interruption capabilities.
     *
     * In this method, we commit styles back to the DOM before cancelling
     * the animation.
     *
     * This is designed to be overridden by NativeAnimationExtended, which
     * will create a renderless JS animation and sample it twice to calculate
     * its current value, "previous" value, and therefore allow
     * Motion to also correctly calculate velocity for any subsequent animation
     * while deferring the commit until the next animation frame.
     */
    private commitStyles() {
        if (this.animation.commitStyles) {
            this.animation.commitStyles()
        }
    }

    get duration() {
        const duration =
            this.animation.effect?.getComputedTiming().duration ||
            defaultDuration

        return millisecondsToSeconds(Number(duration))
    }

    get time() {
        return millisecondsToSeconds(Number(this.animation.currentTime) || 0)
    }

    set time(newTime: number) {
        this.animation.currentTime = secondsToMilliseconds(newTime)
    }

    /**
     * The playback speed of the animation.
     * 1 = normal speed, 2 = double speed, 0.5 = half speed.
     */
    get speed() {
        return this.animation.playbackRate
    }

    set speed(newSpeed: number) {
        this.animation.playbackRate = newSpeed
    }

    get state() {
        return this.animation.playState
    }

    get startTime() {
        return Number(this.animation.startTime)
    }

    get finished() {
        return this.animation.finished
    }

    flatten() {
        if (this.allowFlatten) {
            this.animation.effect?.updateTiming({ easing: "linear" })
        }
    }

    /**
     * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
     */
    attachTimeline(timeline: ProgressTimeline): VoidFunction {
        this.animation.timeline = timeline as any
        this.animation.onfinish = null

        return noop<void>
    }

    /**
     * Allows the animation to be awaited.
     *
     * @deprecated Use `finished` instead.
     */
    then(onResolve: VoidFunction, onReject?: VoidFunction): Promise<void> {
        return this.finished.then(onResolve).catch(onReject)
    }
}
