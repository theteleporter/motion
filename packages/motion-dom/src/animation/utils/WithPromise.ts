export class WithPromise {
    finished: Promise<void>

    resolve: VoidFunction

    protected updateFinished() {
        this.finished = new Promise<void>((resolve) => {
            this.resolve = resolve
        })
    }

    protected notifyFinished() {
        this.resolve()
        this.updateFinished()
    }

    constructor() {
        this.updateFinished()
    }

    /**
     * Allows the animation to be awaited.
     *
     * @deprecated Use `finished` instead.
     */
    then(onResolve: VoidFunction, onReject?: VoidFunction) {
        return this.finished.then(onResolve, onReject)
    }
}
