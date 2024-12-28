import "./types"
import { AnimationPlaybackControls } from "../animation/types"

export class ViewTransitionBuilder {
    private currentTarget = "root"

    constructor(
        private update: () => void | Promise<void>,
        private defaultOptions: ViewTransitionOptions
    ) {}

    then(): AnimationPlaybackControls {}

    enter() {
        return this
    }

    exit() {
        return this
    }
}

export function view(
    update: () => void | Promise<void>,
    defaultOptions: ViewTransitionOptions = {}
) {
    return new ViewTransitionBuilder(update, defaultOptions)
}
