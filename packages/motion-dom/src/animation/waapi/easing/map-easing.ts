import { isBezierDefinition } from "../../../utils/is-bezier-definition"
import { supportsLinearEasing } from "../../../utils/supports/linear-easing"
import { Easing } from "../../types"
import { generateLinearEasing } from "../utils/linear"
import { cubicBezierAsString } from "./cubic-bezier"
import { supportedWaapiEasing } from "./supported"

export function mapEasingToNativeEasing(
    easing: Easing | Easing[] | undefined,
    duration: number
): undefined | string | string[] {
    if (!easing) {
        return undefined
    } else if (typeof easing === "function" && supportsLinearEasing()) {
        return generateLinearEasing(easing, duration)
    } else if (isBezierDefinition(easing)) {
        return cubicBezierAsString(easing)
    } else if (Array.isArray(easing)) {
        return easing.map(
            (segmentEasing) =>
                (mapEasingToNativeEasing(segmentEasing, duration) as string) ||
                supportedWaapiEasing.easeOut
        )
    } else {
        return supportedWaapiEasing[easing as keyof typeof supportedWaapiEasing]
    }
}
