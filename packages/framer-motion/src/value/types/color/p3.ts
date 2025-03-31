import { alpha as alphaType, number } from "../numbers"
import { P3 } from "../types"
import { floatRegex } from "../utils/float-regex"
import { sanitize } from "../utils/sanitize"
import { isColorString } from "./utils"

const clampP3Unit = (v: number) => Math.max(0, Math.min(1, v))
export const p3Unit = {
    ...number,
    transform: (v: number) => clampP3Unit(v),
}

function parseP3(v: string): P3 {
    if (typeof v !== "string") return v as any

    // Trim "color(display-p3" from the string if it exists
    const trimmed = v.includes("color(display-p3")
        ? v.replace("color(display-p3", "")
        : v

    // Extract all numbers from the string (r, g, b, alpha)
    const matches = trimmed.match(floatRegex) as any
    if (!matches || matches.length < 3)
        return { p3_r: 0, p3_g: 0, p3_b: 0, alpha: 1 }

    const [r, g, b, alpha] = matches
    return {
        p3_r: parseFloat(r),
        p3_g: parseFloat(g),
        p3_b: parseFloat(b),
        alpha: alpha !== undefined ? parseFloat(alpha) : 1,
    }
}

export const p3 = {
    test: /*@__PURE__*/ isColorString("color(display-p3", "p3_r"),
    parse: parseP3,
    transform: ({ p3_r, p3_g, p3_b, alpha = 1 }: P3) =>
        "color(display-p3 " +
        p3Unit.transform(p3_r) +
        " " +
        p3Unit.transform(p3_g) +
        " " +
        p3Unit.transform(p3_b) +
        (alpha !== 1 ? " / " + sanitize(alphaType.transform(alpha)) : "") +
        ")",
}
