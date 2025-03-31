import { HSLA, P3, RGBA } from "../types"
import { hex } from "./hex"
import { hsla } from "./hsla"
import { p3 } from "./p3"
import { rgba } from "./rgba"

export const color = {
    test: (v: any) => rgba.test(v) || hex.test(v) || hsla.test(v) || p3.test(v),
    parse: (v: any): RGBA | HSLA | P3 => {
        if (rgba.test(v)) {
            return rgba.parse(v)
        } else if (hsla.test(v)) {
            return hsla.parse(v)
        } else if (p3.test(v)) {
            return p3.parse(v)
        } else {
            return hex.parse(v)
        }
    },
    transform: (v: HSLA | RGBA | P3 | string) => {
        return typeof v === "string"
            ? v
            : v.hasOwnProperty("red")
            ? rgba.transform(v as RGBA)
            : v.hasOwnProperty("p3_r")
            ? p3.transform(v as P3)
            : hsla.transform(v as HSLA)
    },
}
