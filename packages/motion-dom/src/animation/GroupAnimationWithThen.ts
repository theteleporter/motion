import { noop } from "motion-utils"
import { GroupAnimation } from "./GroupAnimation"
import { AnimationPlaybackControlsWithThen } from "./types"

export class GroupAnimationWithThen
    extends GroupAnimation
    implements AnimationPlaybackControlsWithThen
{
    then(onResolve: VoidFunction, _onReject?: VoidFunction) {
        return this.finished
            .then(() => {
                onResolve()
                console.log("onResolve")
            })
            .catch(noop)
    }
}
