import { isCSSVar } from "../../render/dom/is-css-var"
import { transformProps } from "../../render/utils/keys-transform"
import {
    ElementOrSelector,
    resolveElements,
} from "../../utils/resolve-elements"
import { MotionValue } from "../../value"
import { MotionValueState } from "../MotionValueState"
import { buildTransform } from "./transform"

const stateMap = new WeakMap<Element, MotionValueState>()

export function styleEffect(
    subject: ElementOrSelector,
    values: Record<string, MotionValue>
) {
    const elements = resolveElements(subject) as HTMLElement[]
    const subscriptions: VoidFunction[] = []

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        const state = stateMap.get(element) ?? new MotionValueState()

        stateMap.set(element, state)

        for (const key in values) {
            const value = values[key]
            const remove = addValue(element, state, key, value)
            subscriptions.push(remove)
        }
    }

    return () => {
        for (const cancel of subscriptions) cancel()
    }
}

function addValue(
    element: HTMLElement,
    state: MotionValueState,
    key: string,
    value: MotionValue
) {
    let render: VoidFunction | undefined = undefined
    let computed: MotionValue | undefined = undefined

    if (transformProps.has(key)) {
        if (!state.get("transform")) {
            state.set("transform", new MotionValue("none"), () => {
                element.style.transform = buildTransform(state)
            })
        }

        computed = state.get("transform")
    } else if (isCSSVar(key)) {
        render = () => {
            element.style.setProperty(key, state.latest[key] as string)
        }
    } else {
        render = () => {
            element.style[key as any] = state.latest[key] as string
        }
    }

    return state.set(key, value, render, computed)
}
