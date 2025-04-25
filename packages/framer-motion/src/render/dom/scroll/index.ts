import { AnimationPlaybackControls } from "motion-dom"
import { attachToAnimation } from "./attach-animation"
import { attachToFunction } from "./attach-function"
import { OnScroll, ScrollOptions } from "./types"

export function scroll(
    onScroll: OnScroll | AnimationPlaybackControls,
    {
        axis = "y",
        container = document.documentElement,
        ...options
    }: ScrollOptions = {}
): VoidFunction {
    /**
     * If the container is the document.documentElement and the scrollHeight
     * and clientHeight are the same, we need to use the document.body instead
     * as this is the scrollable document element.
     */
    if (
        container === document.documentElement &&
        container.scrollHeight === container.clientHeight
    ) {
        container = document.body
    }

    const optionsWithDefaults = { axis, container, ...options }

    return typeof onScroll === "function"
        ? attachToFunction(onScroll, optionsWithDefaults)
        : attachToAnimation(onScroll, optionsWithDefaults)
}
