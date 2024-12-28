import { fillOffset } from "./fill";
export function defaultOffset(arr) {
    const offset = [0];
    fillOffset(offset, arr.length - 1);
    return offset;
}
//# sourceMappingURL=default.js.map