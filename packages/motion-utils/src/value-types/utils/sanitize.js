// If this number is a decimal, make it just five decimal places
// to avoid exponents
export const sanitize = (v) => Math.round(v * 100000) / 100000;
//# sourceMappingURL=sanitize.js.map