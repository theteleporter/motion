import { ElementOrSelector } from "../../utils/resolve-elements"
import { isDragActive } from "../drag/state/is-active"
import { EventOptions } from "../types"
import { isNodeOrChild } from "../utils/is-node-or-child"
import { isPrimaryPointer } from "../utils/is-primary-pointer"
import { setupGesture } from "../utils/setup"
import { OnPressStartEvent } from "./types"
import { isElementKeyboardAccessible } from "./utils/is-keyboard-accessible"
import { enableKeyboardPress } from "./utils/keyboard"
import { isPressing } from "./utils/state"

/**
 * Filter out events that are not primary pointer events, or are triggering
 * while a Motion gesture is active.
 */
function isValidPressEvent(event: PointerEvent) {
    return isPrimaryPointer(event) && !isDragActive()
}

export interface PointerEventOptions extends EventOptions {
    useGlobalTarget?: boolean
}

/**
 * Create a press gesture.
 *
 * Press is different to `"pointerdown"`, `"pointerup"` in that it
 * automatically filters out secondary pointer events like right
 * click and multitouch.
 *
 * It also adds accessibility support for keyboards, where
 * an element with a press gesture will receive focus and
 *  trigger on Enter `"keydown"` and `"keyup"` events.
 *
 * This is different to a browser's `"click"` event, which does
 * respond to keyboards but only for the `"click"` itself, rather
 * than the press start and end/cancel. The element also needs
 * to be focusable for this to work, whereas a press gesture will
 * make an element focusable by default.
 *
 * @public
 */
export function press(
    elementOrSelector: ElementOrSelector,
    onPressStart: OnPressStartEvent,
    options: PointerEventOptions = {}
): VoidFunction {
    const [elements, eventOptions, cancelEvents] = setupGesture(
        elementOrSelector,
        options
    )

    const startPress = (startEvent: PointerEvent) => {
        const target = startEvent.currentTarget as Element

        if (!target || !isValidPressEvent(startEvent) || isPressing.has(target))
            return

        isPressing.add(target)

        if (target.setPointerCapture && startEvent.pointerId !== undefined) {
            try {
                target.setPointerCapture(startEvent.pointerId)
            } catch (e) {}
        }

        const onPressEnd = onPressStart(target, startEvent)

        const onPointerEnd = (endEvent: PointerEvent, success: boolean) => {
            target.removeEventListener("pointerup", onPointerUp)
            target.removeEventListener("pointercancel", onPointerCancel)
            target.removeEventListener("lostpointercapture", onPointerCancel)

            if (
                target.releasePointerCapture &&
                endEvent.pointerId !== undefined
            ) {
                try {
                    target.releasePointerCapture(endEvent.pointerId)
                } catch (e) {}
            }

            if (!isValidPressEvent(endEvent) || !isPressing.has(target)) {
                return
            }

            isPressing.delete(target)

            if (typeof onPressEnd === "function") {
                onPressEnd(endEvent, { success })
            }
        }

        const onPointerUp = (upEvent: PointerEvent) => {
            onPointerEnd(
                upEvent,
                options.useGlobalTarget ||
                    isNodeOrChild(target, upEvent.target as Element)
            )
        }

        const onPointerCancel = (cancelEvent: PointerEvent) => {
            onPointerEnd(cancelEvent, false)
        }

        target.addEventListener("pointerup", onPointerUp, eventOptions)
        target.addEventListener("pointercancel", onPointerCancel, eventOptions)
        target.addEventListener(
            "lostpointercapture",
            onPointerCancel,
            eventOptions
        )
    }

    elements.forEach((element: Element) => {
        if (
            !isElementKeyboardAccessible(element) &&
            element.getAttribute("tabindex") === null
        ) {
            ;(element as HTMLElement).tabIndex = 0
        }

        const target = options.useGlobalTarget ? window : element
        target.addEventListener(
            "pointerdown",
            startPress as EventListener,
            eventOptions
        )

        if (!options.useGlobalTarget) {
            element.addEventListener(
                "focus",
                (event) =>
                    enableKeyboardPress(event as FocusEvent, eventOptions),
                eventOptions
            )
        }
    })

    return cancelEvents
}
