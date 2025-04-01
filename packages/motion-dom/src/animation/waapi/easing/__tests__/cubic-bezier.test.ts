import { BezierDefinition } from "../../../types"
import { cubicBezierAsString } from "../cubic-bezier"

describe("cubicBezierAsString", () => {
    test("should convert a bezier definition to a cubic-bezier string", () => {
        const bezier: BezierDefinition = [0.42, 0, 1, 1]
        expect(cubicBezierAsString(bezier)).toBe("cubic-bezier(0.42, 0, 1, 1)")
    })
})
