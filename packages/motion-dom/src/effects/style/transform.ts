import { transformPropOrder } from "../../render/utils/keys-transform"
import { numberValueTypes } from "../../value/types/maps/number"
import { getValueAsType } from "../../value/types/utils/get-as-type"
import { MotionValueState } from "../MotionValueState"

const translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
}

export function buildTransform(state: MotionValueState) {
    let transform = ""
    let transformIsDefault = true

    /**
     * Loop over all possible transforms in order, adding the ones that
     * are present to the transform string.
     */
    for (let i = 0; i < transformPropOrder.length; i++) {
        const key = transformPropOrder[i] as keyof typeof translateAlias
        const value = state.latest[key]

        if (value === undefined) continue

        let valueIsDefault = true
        if (typeof value === "number") {
            valueIsDefault = value === (key.startsWith("scale") ? 1 : 0)
        } else {
            valueIsDefault = parseFloat(value) === 0
        }

        if (!valueIsDefault) {
            const valueAsType = getValueAsType(value, numberValueTypes[key])

            transformIsDefault = false
            const transformName = translateAlias[key] || key
            transform += `${transformName}(${valueAsType}) `
        }
    }
    return transformIsDefault ? "none" : transform.trim()
}
