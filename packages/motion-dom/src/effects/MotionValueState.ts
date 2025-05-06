import { cancelFrame, frame } from "../frameloop/frame"
import { MotionValue } from "../value"

export class MotionValueState {
    latest: { [key: string]: string | number } = {}

    private values = new Map<
        string,
        { value: MotionValue; onRemove: VoidFunction }
    >()

    set(
        key: string,
        value: MotionValue,
        render?: VoidFunction,
        computed?: MotionValue
    ) {
        const existingValue = this.values.get(key)

        if (existingValue) {
            existingValue.onRemove()
        }

        const onChange = () => {
            this.latest[key] = value.get()
            render && frame.render(render)
        }

        onChange()

        const cancelOnChange = value.on("change", onChange)

        computed && value.addDependent(computed)

        const remove = () => {
            cancelOnChange()
            render && cancelFrame(render)
            this.values.delete(key)
            computed && value.removeDependent(computed)
        }

        this.values.set(key, { value, onRemove: remove })

        return remove
    }

    remove(key: string, value: MotionValue) {
        const existingValue = this.values.get(key)
        if (existingValue?.value === value) {
            existingValue.onRemove()
            this.values.delete(key)
        }
    }

    get(key: string): MotionValue | undefined {
        return this.values.get(key)?.value
    }

    destroy() {
        for (const value of this.values.values()) {
            value.onRemove()
        }
    }
}
