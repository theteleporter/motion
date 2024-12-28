import { clamp } from "../../clamp";
export const number = {
    test: (v) => typeof v === "number",
    parse: parseFloat,
    transform: (v) => v,
};
export const alpha = {
    ...number,
    transform: (v) => clamp(0, 1, v),
};
export const scale = {
    ...number,
    default: 1,
};
//# sourceMappingURL=index.js.map