import { NativeAnimation } from "./NativeAnimation"

export class NativeAnimationWrapper extends NativeAnimation {
    constructor(animation: Animation) {
        super()

        this.animation = animation
        animation.onfinish = () => {
            this.finishedTime = this.time
            this.notifyFinished()
        }
    }
}
