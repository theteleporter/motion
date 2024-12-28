import "./types"

let currentTransition: ViewTransition | null = null
let pendingTransition: VoidFunction | null = null

export async function view(
    selector: string,
    update: () => void | Promise<void>
) {
    if (!document.startViewTransition) {
        await update()
        return
    }

    function startTransition() {
        const elements = document.querySelectorAll(
            selector
        ) as NodeListOf<HTMLElement>

        let index = 0

        const transitionNames = new Set<string>()

        for (const element of elements) {
            index++
            const name = `motion-${index}`
            element.style.viewTransitionName = name
            transitionNames.add(name)
        }

        const transition = document.startViewTransition!(async () => {
            await update()
        })

        transition.ready
            .then(() => {
                const viewAnimations = getViewAnimations()

                for (const animation of viewAnimations) {
                    const pseudoElement = animation.effect?.pseudoElement
                    if (!pseudoElement) continue

                    // Extract the name from ::view-transition-old(name) or ::view-transition-new(name)
                    const match = pseudoElement.match(
                        /::view-transition-(?:old|new|group|image-pair)\((.*?)\)/
                    )
                    if (!match) continue

                    const name = match[1]
                    if (transitionNames.has(name)) {
                        const keyframes = animation.effect!.getKeyframes()

                        const [firstKeyframe] = keyframes

                        if (firstKeyframe.transform) {
                            const splitTransform = (
                                firstKeyframe.transform as string
                            ).split(",")
                            const x = parseFloat(splitTransform[4])
                            const y = parseFloat(splitTransform[5])
                        }

                        animation.effect!.updateTiming({
                            duration: 2000,
                        })
                    } else {
                        animation.finish()
                    }
                }
            })
            .catch(() => {})

        transition.finished.finally(() => {
            for (const element of elements) {
                element.style.viewTransitionName = ""
            }

            currentTransition = null

            if (pendingTransition) {
                pendingTransition()
                pendingTransition = null
            }
        })

        currentTransition = transition
    }

    if (currentTransition) {
        pendingTransition = startTransition
    } else {
        startTransition()
    }
}

function getViewAnimations() {
    return document
        .getAnimations()
        .filter(
            (animation) =>
                animation.effect?.target === document.documentElement &&
                animation.effect?.pseudoElement?.startsWith("::view-transition")
        )
}
