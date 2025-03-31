import { warning } from "motion-utils"
import { hex } from "../../value/types/color/hex"
import { hsla } from "../../value/types/color/hsla"
import { p3 } from "../../value/types/color/p3"
import { rgba } from "../../value/types/color/rgba"
import { Color, HSLA, P3, RGBA } from "../../value/types/types"
import { hslaToRgba } from "../hsla-to-rgba"
import { mixImmediate } from "./immediate"
import { mixNumber } from "./number"

// Linear color space blending
// Explained https://www.youtube.com/watch?v=LKnqECcg6Gw
// Demonstrated http://codepen.io/osublake/pen/xGVVaN
export const mixLinearColor = (from: number, to: number, v: number) => {
    const fromExpo = from * from
    const expo = v * (to * to - fromExpo) + fromExpo
    return expo < 0 ? 0 : Math.sqrt(expo)
}

const colorTypes = [hex, rgba, hsla, p3]
const getColorType = (v: Color | string) =>
    colorTypes.find((type) => type.test(v))

function asRGBA(color: any) {
    const type = getColorType(color)

    warning(
        Boolean(type),
        `'${
            typeof color === "string" ? color : JSON.stringify(color)
        }' is not an animatable color. Use the equivalent color code instead.`
    )

    if (!Boolean(type)) return false

    let model = type!.parse(color)

    if (type === hsla) {
        // TODO Remove this cast - needed since Motion's stricter typing
        model = hslaToRgba(model as HSLA)
    } else if (type === p3) {
        // Handle P3 color as it is
        return model as P3
    }

    return model as RGBA
}

function isP3(color: any): color is P3 {
    return color && color.hasOwnProperty("p3_r")
}

/**
 * Convert RGBA to P3
 * Note: This is a very simplified conversion and not color-space accurate.
 * For accurate conversion, color profiles and matrices would be needed.
 */
function rgbaToP3(rgbaColor: RGBA): P3 {
    // For a basic approximation, we normalize the RGB values from 0-255 to 0-1 range
    return {
        p3_r: rgbaColor.red / 255,
        p3_g: rgbaColor.green / 255,
        p3_b: rgbaColor.blue / 255,
        alpha: rgbaColor.alpha,
    }
}

export const mixColor = (from: Color | string, to: Color | string) => {
    const fromColor = asRGBA(from)
    const toColor = asRGBA(to)

    if (!fromColor || !toColor) {
        return mixImmediate(from, to)
    }

    // Handle case where one is P3 and the other is RGBA
    const fromIsP3 = isP3(fromColor)
    const toIsP3 = isP3(toColor)

    // If either is P3, convert both to P3 for mixing
    if (fromIsP3 || toIsP3) {
        const fromP3 = fromIsP3
            ? (fromColor as P3)
            : rgbaToP3(fromColor as RGBA)
        const toP3 = toIsP3 ? (toColor as P3) : rgbaToP3(toColor as RGBA)
        const blended = { ...fromP3 }

        return (v: number) => {
            blended.p3_r = mixLinearColor(fromP3.p3_r, toP3.p3_r, v)
            blended.p3_g = mixLinearColor(fromP3.p3_g, toP3.p3_g, v)
            blended.p3_b = mixLinearColor(fromP3.p3_b, toP3.p3_b, v)
            blended.alpha = mixNumber(fromP3.alpha, toP3.alpha, v)
            return p3.transform!(blended)
        }
    }

    // Handle standard RGBA colors
    const fromRGBA = fromColor as RGBA
    const toRGBA = toColor as RGBA
    const blended = { ...fromRGBA }

    return (v: number) => {
        blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v)
        blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v)
        blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v)
        blended.alpha = mixNumber(fromRGBA.alpha, toRGBA.alpha, v)
        return rgba.transform!(blended)
    }
}
