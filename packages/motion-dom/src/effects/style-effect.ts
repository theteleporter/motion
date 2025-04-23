import { cancelFrame, frame } from "../frameloop"
import { ElementOrSelector, resolveElements } from "../utils/resolve-elements"
import { MotionValue } from "../value"

export function styleEffect(
    subject: ElementOrSelector,
    values: Record<string, MotionValue>
) {
    const elements = resolveElements(subject) as HTMLElement[]
    const subscriptions: VoidFunction[] = []

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i]

        for (const key in values) {
            const value = values[key]

            /**
             * TODO: Get specific setters for combined props (like x)
             * or values with default types (like color)
             *
             * TODO: CSS variable support
             */
            const updateStyle = () => {
                element.style[key as any] = value.get()
            }

            const scheduleUpdate = () => frame.render(updateStyle)

            const cancel = value.on("change", scheduleUpdate)

            scheduleUpdate()

            subscriptions.push(() => {
                cancel()
                cancelFrame(updateStyle)
            })
        }
    }

    return () => {
        for (const cancel of subscriptions) {
            cancel()
        }
    }
}
