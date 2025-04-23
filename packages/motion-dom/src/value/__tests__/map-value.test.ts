import { motionValue } from "../../"
import { mapValue } from "../map-value"

describe("mapValue", () => {
    test("sets initial value", () => {
        const x = motionValue(100)
        const opacity = mapValue(x, [0, 200], [0, 1])

        expect(opacity.get()).toBe(0.5)
    })

    test("updates when source value changes", () => {
        const x = motionValue(100)
        const opacity = mapValue(x, [0, 200], [0, 1])

        x.set(20)
        expect(opacity.get()).toBe(0.1)
    })

    test("maps values correctly across different ranges", () => {
        const x = motionValue(20)
        const opacity = mapValue(x, [0, 100], [0, 1])

        expect(opacity.get()).toBe(0.2)

        // Change input range
        const y = motionValue(20)
        const newOpacity = mapValue(y, [0, 50], [0, 1])
        expect(newOpacity.get()).toBe(0.4)

        // Change output range
        const z = motionValue(20)
        const scaledOpacity = mapValue(z, [0, 50], [0, 0.5])
        expect(scaledOpacity.get()).toBe(0.2)
    })

    test("works with multiple input range steps", () => {
        const x = motionValue(50)
        const opacity = mapValue(x, [-200, -100, 100, 200], [0, 1, 1, 0])

        expect(opacity.get()).toBe(1)

        x.set(-150)
        expect(opacity.get()).toBe(0.5)

        x.set(150)
        expect(opacity.get()).toBe(0.5)

        x.set(-200)
        expect(opacity.get()).toBe(0)

        x.set(200)
        expect(opacity.get()).toBe(0)
    })

    test("clamps values by default", () => {
        const x = motionValue(300)
        const opacity = mapValue(x, [0, 200], [0, 1])

        expect(opacity.get()).toBe(1)

        x.set(-100)
        expect(opacity.get()).toBe(0)
    })

    test("can disable clamping", () => {
        const x = motionValue(300)
        const opacity = mapValue(x, [0, 200], [0, 1], { clamp: false })

        expect(opacity.get()).toBe(1.5)

        x.set(-100)
        expect(opacity.get()).toBe(-0.5)
    })

    test("works with string output ranges", () => {
        const x = motionValue(0.5)
        const y = mapValue(x, [0, 1], ["0px", "100px"])

        expect(y.get()).toBe("50px")

        x.set(0.25)
        expect(y.get()).toBe("25px")

        x.set(1.5)
        expect(y.get()).toBe("100px") // Clamped by default
    })
})
