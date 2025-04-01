import { isBezierDefinition } from "../../../utils/is-bezier-definition"
import { supportsLinearEasing } from "../../../utils/supports/linear-easing"
import { Easing } from "../../types"
import { supportedWaapiEasing } from "./supported"

export function isWaapiSupportedEasing(easing?: Easing | Easing[]): boolean {
    return Boolean(
        (typeof easing === "function" && supportsLinearEasing()) ||
            !easing ||
            (typeof easing === "string" &&
                (easing in supportedWaapiEasing || supportsLinearEasing())) ||
            isBezierDefinition(easing) ||
            (Array.isArray(easing) && easing.every(isWaapiSupportedEasing))
    )
}
