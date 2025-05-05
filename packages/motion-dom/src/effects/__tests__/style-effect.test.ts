import { frame } from "../../frameloop"
import { motionValue } from "../../value"
import { styleEffect } from "../style-effect"

async function nextFrame() {
    return new Promise<void>((resolve) => {
        frame.postRender(() => resolve())
    })
}

describe("styleEffect", () => {
    it("sets styles after styleEffect is applied", async () => {
        const element = document.createElement("div")

        // Create motion values
        const width = motionValue("100px")
        const color = motionValue("red")

        // Apply style effect
        styleEffect(element, {
            width,
            color,
        })

        await nextFrame()

        // Verify styles are set
        expect(element.style.width).toBe("100px")
        expect(element.style.color).toBe("red")
    })

    it("updates styles when motion values change", async () => {
        const element = document.createElement("div")
        // Create motion values
        const width = motionValue("100px")
        const color = motionValue("red")

        // Apply style effect
        styleEffect(element, {
            width,
            color,
        })

        await nextFrame()

        // Verify initial styles
        expect(element.style.width).toBe("100px")
        expect(element.style.color).toBe("red")

        // Change motion values
        width.set("200px")
        color.set("blue")

        // Updates should be scheduled for the next frame render
        // Styles should not have changed yet
        expect(element.style.width).toBe("100px")
        expect(element.style.color).toBe("red")

        await nextFrame()

        // Verify styles are updated
        expect(element.style.width).toBe("200px")
        expect(element.style.color).toBe("blue")
    })

    it("supports independent transform values", async () => {
        const element = document.createElement("div")

        // Create motion values
        const x = motionValue("100%")
        const transformPerspective = motionValue(500)
        const scaleY = motionValue(2)

        // Apply style effect
        styleEffect(element, {
            x,
            transformPerspective,
            scaleY,
        })

        await nextFrame()

        // Verify initial styles
        expect(element.style.transform).toBe(
            "perspective(500px) translateX(100%) scaleY(2)"
        )

        // Change motion values
        x.set("50%")
        transformPerspective.set(1000)
        scaleY.set(1)

        // Updates should be scheduled for the next frame render
        // Styles should not have changed yet
        expect(element.style.transform).toBe(
            "perspective(500px) translateX(100%) scaleY(2)"
        )

        await nextFrame()

        // Verify styles are updated
        expect(element.style.transform).toBe(
            "perspective(1000px) translateX(50%) scaleY(1)"
        )
    })

    it("supports independent transform values split across multiple styleEffects", async () => {
        const element = document.createElement("div")

        // Create motion values
        const x = motionValue("100%")
        const transformPerspective = motionValue(500)
        const scaleY = motionValue(2)

        // Apply style effect
        styleEffect(element, { x })
        styleEffect(element, { transformPerspective, scaleY })

        await nextFrame()

        // Verify initial styles
        expect(element.style.transform).toBe(
            "perspective(500px) translateX(100%) scaleY(2)"
        )

        // Change motion values
        x.set("50%")
        transformPerspective.set(1000)
        scaleY.set(1)

        // Updates should be scheduled for the next frame render
        // Styles should not have changed yet
        expect(element.style.transform).toBe(
            "perspective(500px) translateX(100%) scaleY(2)"
        )

        await nextFrame()

        // Verify styles are updated
        expect(element.style.transform).toBe(
            "perspective(1000px) translateX(50%) scaleY(1)"
        )
    })

    it("handles multiple elements", async () => {
        // Create additional elements
        const element = document.createElement("div")
        const element2 = document.createElement("div")

        const margin = motionValue("10px")
        const backgroundColor = motionValue("yellow")

        styleEffect([element, element2], {
            margin,
            backgroundColor,
        })

        await nextFrame()

        expect(element.style.margin).toBe("10px")
        expect(element.style.backgroundColor).toBe("yellow")
        expect(element2.style.margin).toBe("10px")
        expect(element2.style.backgroundColor).toBe("yellow")

        margin.set("20px")
        backgroundColor.set("green")

        await nextFrame()

        expect(element.style.margin).toBe("20px")
        expect(element.style.backgroundColor).toBe("green")
    })

    it("returns cleanup function that stops updating styles", async () => {
        const element = document.createElement("div")
        // Create motion values
        const padding = motionValue("5px")
        const opacity = motionValue("0.5")

        // Apply style effect and get cleanup function
        const cleanup = styleEffect(element, {
            padding,
            opacity,
        })

        await nextFrame()

        // Verify initial styles
        expect(element.style.padding).toBe("5px")
        expect(element.style.opacity).toBe("0.5")

        // Change values and verify update on next frame
        padding.set("10px")
        opacity.set("0.8")

        await nextFrame()

        // Verify update happened
        expect(element.style.padding).toBe("10px")
        expect(element.style.opacity).toBe("0.8")

        // Call cleanup function
        cleanup()

        // Change values again
        padding.set("15px")
        opacity.set("1")

        await nextFrame()

        // Verify styles didn't change after cleanup
        expect(element.style.padding).toBe("10px")
        expect(element.style.opacity).toBe("0.8")
    })

    it("returns cleanup function that stops updating styles that have already been scheduled", async () => {
        const element = document.createElement("div")

        // Create motion values
        const padding = motionValue("5px")
        const opacity = motionValue("0.5")

        // Apply style effect and get cleanup function
        const cleanup = styleEffect(element, {
            padding,
            opacity,
        })

        await nextFrame()

        // Verify initial styles
        expect(element.style.padding).toBe("5px")
        expect(element.style.opacity).toBe("0.5")

        // Change values and verify update on next frame
        padding.set("10px")
        opacity.set("0.8")

        await nextFrame()

        // Verify update happened
        expect(element.style.padding).toBe("10px")
        expect(element.style.opacity).toBe("0.8")

        // Change values again
        padding.set("15px")
        opacity.set("1")

        // Call cleanup function
        cleanup()

        // Check that values don't update on the next frame
        await nextFrame()

        // Verify styles didn't change after cleanup
        expect(element.style.padding).toBe("10px")
        expect(element.style.opacity).toBe("0.8")
    })
})
