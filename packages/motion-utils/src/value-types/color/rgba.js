import { clamp } from "../../clamp";
import { alpha as alphaType, number } from "../numbers";
import { sanitize } from "../utils/sanitize";
import { isColorString, splitColor } from "./utils";
const clampRgbUnit = (v) => clamp(0, 255, v);
export const rgbUnit = {
    ...number,
    transform: (v) => Math.round(clampRgbUnit(v)),
};
export const rgba = {
    test: /*@__PURE__*/ isColorString("rgb", "red"),
    parse: /*@__PURE__*/ splitColor("red", "green", "blue"),
    transform: ({ red, green, blue, alpha = 1 }) => "rgba(" +
        rgbUnit.transform(red) +
        ", " +
        rgbUnit.transform(green) +
        ", " +
        rgbUnit.transform(blue) +
        ", " +
        sanitize(alphaType.transform(alpha)) +
        ")",
};
//# sourceMappingURL=rgba.js.map