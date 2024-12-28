import { getMixer } from "./complex";
import { mixNumber as mixNumberImmediate } from "./number";
export function mix(from, to, p) {
    if (typeof from === "number" &&
        typeof to === "number" &&
        typeof p === "number") {
        return mixNumberImmediate(from, to, p);
    }
    const mixer = getMixer(from);
    return mixer(from, to);
}
//# sourceMappingURL=index.js.map