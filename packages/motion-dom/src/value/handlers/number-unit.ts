import { ValueHandler } from "./types"

const createUnitType = (
    unit: string
): ValueHandler<number | string, number, string> => ({
    test: (v) =>
        typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
    parse: (v) => (typeof v === "string" ? parseFloat(v) : v),
    transform: (v) => `${v}${unit}`,
})

export const degrees = /*@__PURE__*/ createUnitType("deg")
export const percent = /*@__PURE__*/ createUnitType("%")
export const px = /*@__PURE__*/ createUnitType("px")
export const vh = /*@__PURE__*/ createUnitType("vh")
export const vw = /*@__PURE__*/ createUnitType("vw")

export const progressPercentage: ValueHandler<number | string, number, string> =
    {
        ...percent,
        parse: (v) => percent.parse(v) / 100,
        transform: (v) => percent.transform(v * 100),
    }
