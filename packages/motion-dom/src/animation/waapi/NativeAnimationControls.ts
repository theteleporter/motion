import { noop } from "motion-utils"
import {
    AnimationPlaybackControlsWithFinished,
    ValueAnimationOptions,
} from "../types"
import { attachTimeline } from "./utils/attach-timeline"

export class NativeAnimationControls
    implements Omit<AnimationPlaybackControlsWithFinished, "then">
{
    animation?: Animation

    options?: ValueAnimationOptions

    constructor(animation?: Animation) {
        this.animation = animation
    }

    play() {
        this.animation && this.animation.play()
    }

    pause() {
        this.animation && this.animation.pause()
    }

    stop() {
        if (
            !this.animation ||
            this.state === "idle" ||
            this.state === "finished"
        ) {
            return
        }

        if (this.animation.commitStyles) {
            this.animation.commitStyles()
        }
        this.cancel()
    }

    flatten() {
        if (!this.animation || !this.options?.allowFlatten) return

        this.animation.effect?.updateTiming({ easing: "linear" })
    }

    attachTimeline(timeline: any) {
        if (this.animation) attachTimeline(this.animation, timeline)

        return noop<void>
    }

    complete() {
        this.animation && this.animation.finish()
    }

    cancel() {
        try {
            this.animation && this.animation.cancel()
        } catch (e) {}
    }
}
