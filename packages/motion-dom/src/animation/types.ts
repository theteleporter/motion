import { ProgressTimeline } from "../scroll/observe"

/**
 * @public
 */
export interface AnimationPlaybackControls {
    time: number
    speed: number
    startTime: number | null
    state?: AnimationPlayState

    /*
     * The duration is the duration of time calculated for the active part
     * of the animation without delay or repeat,
     * which may be added as an extra prop at a later date.
     */
    duration: number

    stop: () => void
    play: () => void
    pause: () => void
    complete: () => void
    cancel: () => void
    then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>
    attachTimeline?: (
        timeline: ProgressTimeline,
        fallback?: (animation: AnimationPlaybackControls) => VoidFunction
    ) => VoidFunction
    flatten: () => void
}
