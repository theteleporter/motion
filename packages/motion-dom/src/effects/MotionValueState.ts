import { cancelFrame, frame } from "../frameloop/frame"
import { MotionValue } from "../value"
import { numberValueTypes } from "../value/types/maps/number"
import { getValueAsType } from "../value/types/utils/get-as-type"

export class MotionValueState {
    latest: { [name: string]: string | number } = {}

    private values = new Map<
        string,
        { value: MotionValue; onRemove: VoidFunction }
    >()

    set(
        name: string,
        value: MotionValue,
        render?: VoidFunction,
        computed?: MotionValue
    ) {
        const existingValue = this.values.get(name)

        if (existingValue) {
            existingValue.onRemove()
        }

        const onChange = () => {
            this.latest[name] = getValueAsType(
                value.get(),
                numberValueTypes[name]
            )

            render && frame.render(render)
        }

        onChange()

        const cancelOnChange = value.on("change", onChange)

        computed && value.addDependent(computed)

        const remove = () => {
            cancelOnChange()
            render && cancelFrame(render)
            this.values.delete(name)
            computed && value.removeDependent(computed)
        }

        this.values.set(name, { value, onRemove: remove })

        return remove
    }

    get(name: string): MotionValue | undefined {
        return this.values.get(name)?.value
    }

    destroy() {
        for (const value of this.values.values()) {
            value.onRemove()
        }
    }
}
