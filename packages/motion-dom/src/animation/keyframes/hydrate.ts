import { style } from "../../render/dom/style"
import { browserNumberTypes } from "../../value/handlers/collections/browser-number"
import { UnresolvedValueKeyframe, ValueKeyframe } from "../types"
import { supportsPartialKeyframes } from "../waapi/supports/partial-keyframes"

export function hydrateKeyframes(
    element: HTMLElement | SVGElement,
    name: string,
    keyframes: ValueKeyframe[] | UnresolvedValueKeyframe[],
    pseudoElement?: string
) {
    for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i] === null) {
            keyframes[i] =
                i === 0 && !pseudoElement
                    ? style.get(element, name)
                    : keyframes[i - 1]
        }

        if (typeof keyframes[i] === "number" && browserNumberTypes[name]) {
            keyframes[i] = browserNumberTypes[name].transform!(keyframes[i])
        }
    }

    if (!pseudoElement && !supportsPartialKeyframes() && keyframes.length < 2) {
        keyframes.unshift(style.get(element, name))
    }
}
