const createUnitType = (unit) => ({
    test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
    parse: parseFloat,
    transform: (v) => `${v}${unit}`,
});
export const degrees = /*@__PURE__*/ createUnitType("deg");
export const percent = /*@__PURE__*/ createUnitType("%");
export const px = /*@__PURE__*/ createUnitType("px");
export const vh = /*@__PURE__*/ createUnitType("vh");
export const vw = /*@__PURE__*/ createUnitType("vw");
export const progressPercentage = {
    ...percent,
    parse: (v) => percent.parse(v) / 100,
    transform: (v) => percent.transform(v * 100),
};
//# sourceMappingURL=units.js.map