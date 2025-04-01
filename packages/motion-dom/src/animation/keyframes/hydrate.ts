import { style } from "../../render/dom/style"
import { UnresolvedValueKeyframe, ValueKeyframe } from "../types"
import { supportsPartialKeyframes } from "../waapi/supports/partial-keyframes"
import { pxValues } from "../waapi/utils/px-values"

export function hydrateKeyframes(
    element: HTMLElement | SVGElement,
    name: string,
    keyframes: ValueKeyframe | ValueKeyframe[] | UnresolvedValueKeyframe[],
    pseudoElement?: string
): ValueKeyframe[] {
    if (!Array.isArray(keyframes)) {
        keyframes = [keyframes]
    }

    for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i] === null) {
            keyframes[i] =
                i === 0 && !pseudoElement
                    ? style.get(element, name)
                    : keyframes[i - 1]
        }

        if (typeof keyframes[i] === "number" && pxValues.has(name)) {
            keyframes[i] = keyframes[i] + "px"
        }
    }

    if (!pseudoElement && !supportsPartialKeyframes() && keyframes.length < 2) {
        keyframes.unshift(style.get(element, name))
    }

    return keyframes as ValueKeyframe[]
}
