import { frame } from "../../frameloop"
import { motionValue } from "../../value"
import { styleEffect } from "../style-effect"

describe("styleEffect", () => {
    let element: HTMLDivElement

    beforeEach(() => {
        element = document.createElement("div")
        document.body.appendChild(element)
    })

    afterEach(() => {
        document.body.removeChild(element)
    })

    it("sets styles after styleEffect is applied", () => {
        return new Promise<void>((resolve) => {
            // Create motion values
            const width = motionValue("100px")
            const color = motionValue("red")

            // Apply style effect
            styleEffect(element, {
                width,
                color,
            })

            frame.postRender(() => {
                // Verify styles are set
                expect(element.style.width).toBe("100px")
                expect(element.style.color).toBe("red")

                resolve()
            })
        })
    })

    it("updates styles when motion values change", () => {
        return new Promise<void>((resolve) => {
            // Create motion values
            const width = motionValue("100px")
            const color = motionValue("red")

            // Apply style effect
            styleEffect(element, {
                width,
                color,
            })

            frame.postRender(() => {
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

                // Wait for the next frame's render to complete
                frame.postRender(() => {
                    // Verify styles are updated
                    expect(element.style.width).toBe("200px")
                    expect(element.style.color).toBe("blue")
                    resolve()
                })
            })
        })
    })

    it("handles multiple elements", () => {
        // Create additional elements
        const element2 = document.createElement("div")
        document.body.appendChild(element2)

        try {
            // Create motion values
            const margin = motionValue("10px")
            const backgroundColor = motionValue("yellow")

            // Apply style effect to multiple elements
            styleEffect([element, element2], {
                margin,
                backgroundColor,
            })

            frame.postRender(() => {
                // Verify styles are set on both elements
                expect(element.style.margin).toBe("10px")
                expect(element.style.backgroundColor).toBe("yellow")
                expect(element2.style.margin).toBe("10px")
                expect(element2.style.backgroundColor).toBe("yellow")
            })

            // Test cleanup by changing the value and then verifying updates
            return new Promise<void>((resolve) => {
                // Change motion values
                margin.set("20px")
                backgroundColor.set("green")

                // Check updates on next frame
                frame.postRender(() => {
                    expect(element.style.margin).toBe("20px")
                    expect(element.style.backgroundColor).toBe("green")
                    expect(element2.style.margin).toBe("20px")
                    expect(element2.style.backgroundColor).toBe("green")

                    // Clean up
                    document.body.removeChild(element2)
                    resolve()
                })
            })
        } catch (error) {
            // Clean up in case of failure
            document.body.removeChild(element2)
            throw error
        }
    })

    it("returns cleanup function that stops updating styles", () => {
        return new Promise<void>((resolve) => {
            // Create motion values
            const padding = motionValue("5px")
            const opacity = motionValue("0.5")

            // Apply style effect and get cleanup function
            const cleanup = styleEffect(element, {
                padding,
                opacity,
            })

            // Verify initial styles
            expect(element.style.padding).toBe("5px")
            expect(element.style.opacity).toBe("0.5")

            // Change values and verify update on next frame
            padding.set("10px")
            opacity.set("0.8")

            frame.postRender(() => {
                // Verify update happened
                expect(element.style.padding).toBe("10px")
                expect(element.style.opacity).toBe("0.8")

                // Call cleanup function
                cleanup()

                // Change values again
                padding.set("15px")
                opacity.set("1")

                // Check that values don't update on the next frame
                frame.postRender(() => {
                    // Verify styles didn't change after cleanup
                    expect(element.style.padding).toBe("10px")
                    expect(element.style.opacity).toBe("0.8")
                    resolve()
                })
            })
        })
    })
})
