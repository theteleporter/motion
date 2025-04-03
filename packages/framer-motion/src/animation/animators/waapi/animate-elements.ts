import {
    animationMapKey,
    AnimationPlaybackControls,
    AnimationScope,
    applyPxDefaults,
    DOMKeyframesDefinition,
    AnimationOptions as DynamicAnimationOptions,
    ElementOrSelector,
    fillWildcards,
    getAnimationMap,
    getComputedStyle,
    getValueTransition,
    NativeAnimation,
    resolveElements,
} from "motion-dom"
import { invariant, secondsToMilliseconds } from "motion-utils"

export function animateElements(
    elementOrSelector: ElementOrSelector,
    keyframes: DOMKeyframesDefinition,
    options?: DynamicAnimationOptions,
    scope?: AnimationScope
) {
    const elements = resolveElements(elementOrSelector, scope) as Array<
        HTMLElement | SVGElement
    >
    const numElements = elements.length

    invariant(Boolean(numElements), "No valid element provided.")

    const animations: AnimationPlaybackControls[] = []

    for (let i = 0; i < numElements; i++) {
        const element = elements[i]
        const elementTransition = { ...options }

        /**
         * Resolve stagger function if provided.
         */
        if (typeof elementTransition.delay === "function") {
            elementTransition.delay = elementTransition.delay(i, numElements)
        }

        for (const valueName in keyframes) {
            let valueKeyframes = keyframes[valueName as keyof typeof keyframes]!

            if (!Array.isArray(valueKeyframes)) {
                valueKeyframes = [valueKeyframes]
            }

            const valueOptions = {
                ...getValueTransition(elementTransition as any, valueName),
            }

            valueOptions.duration &&= secondsToMilliseconds(
                valueOptions.duration
            )
            valueOptions.delay &&= secondsToMilliseconds(valueOptions.delay)

            /**
             * If there's an existing animation playing on this element then stop it
             * before creating a new one.
             */
            const animationMap = getAnimationMap(element)
            const stateKey = animationMapKey(
                valueName,
                valueOptions.pseudoElement || ""
            )
            const currentAnimation = animationMap.get(stateKey)
            currentAnimation && currentAnimation.stop()

            const { pseudoElement } = valueOptions
            if (!pseudoElement && valueKeyframes[0] === null) {
                valueKeyframes[0] = getComputedStyle(element, valueName)
            }

            fillWildcards(valueKeyframes)
            applyPxDefaults(valueKeyframes, valueName)

            /**
             * If we only have one keyframe, explicitly read the initial keyframe
             * from the computed style. This is to ensure consistency with WAAPI behaviour
             * for restarting animations, for instance .play() after finish, when it
             * has one vs two keyframes.
             */
            if (!pseudoElement && valueKeyframes.length < 2) {
                valueKeyframes.unshift(getComputedStyle(element, valueName))
            }

            const animation = new NativeAnimation({
                ...valueOptions,
                element,
                name: valueName,
                keyframes: valueKeyframes,
                allowFlatten:
                    !elementTransition.type && !elementTransition.ease,
            })

            animation.finished.finally(() => animationMap.delete(stateKey))

            animations.push(animation)
            animationMap.set(stateKey, animation)
        }
    }

    return animations
}
