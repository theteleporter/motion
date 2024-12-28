import { alpha as alphaType } from "../numbers";
import { percent } from "../numbers/units";
import { sanitize } from "../utils/sanitize";
import { isColorString, splitColor } from "./utils";
export const hsla = {
    test: /*@__PURE__*/ isColorString("hsl", "hue"),
    parse: /*@__PURE__*/ splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha = 1 }) => {
        return ("hsla(" +
            Math.round(hue) +
            ", " +
            percent.transform(sanitize(saturation)) +
            ", " +
            percent.transform(sanitize(lightness)) +
            ", " +
            sanitize(alphaType.transform(alpha)) +
            ")");
    },
};
//# sourceMappingURL=hsla.js.map