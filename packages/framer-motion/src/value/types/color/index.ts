import { rgbaToP3, rgbToP3 } from "../../../utils/rgba-to-p3"
import { HSLA, RGBA } from "../types"
import { hex } from "./hex"
import { hsla } from "./hsla"
import { p3 } from "./p3"
import { rgba } from "./rgba"

export { rgbaToP3, rgbToP3 }

export const color = {
    test: (v: any) => rgba.test(v) || hex.test(v) || hsla.test(v) || p3.test(v),
    parse: (v: any): RGBA | HSLA => {
        if (rgba.test(v)) {
            return rgba.parse(v)
        } else if (hsla.test(v)) {
            return hsla.parse(v)
        } else {
            return hex.parse(v)
        }
    },
    transform: (v: HSLA | RGBA | string) => {
        return typeof v === "string"
            ? v
            : v.hasOwnProperty("red")
            ? rgba.transform(v as RGBA)
            : hsla.transform(v as HSLA)
    },
}
