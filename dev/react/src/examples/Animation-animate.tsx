import {
    animate,
    frame,
    scroll,
    transform,
    useMotionValue,
    useMotionValueEvent,
} from "motion/react"
import * as motion from "motion/react-client"
import React from "react"
import "./styles.css"

export function App() {
    const ref = React.useRef(null)
    const animation = React.useRef()
    const progress = React.useRef(0)
    const opacityMotionValue = useMotionValue(0)
    useMotionValueEvent(opacityMotionValue, "change", console.log)

    const startAnimation = React.useCallback(() => {
        const rotate = transform(progress.current, [0, 1], [0, 180])
        const opacity = transform(progress.current, [0, 1], [0.9, 1])
        const scaleX = transform(progress.current, [0, 1], [1, 2])
        const scaleY = transform(progress.current, [0, 1], [1, 2])
        const translateX = transform(progress.current, [0, 1], [0, 20])
        const translateY = transform(progress.current, [0, 1], [0, 20])

        animate(opacityMotionValue, opacity)

        animation.current = animate(
            ref.current,
            {
                rotate,
                opacity,
                scaleX,
                scaleY,
                translateX,
                translateY,
            },
            {
                type: "spring",
                stiffness: 30,
                damping: 3,
            }
        )
    })

    React.useEffect(() => {
        if (!ref.current) return
        const domElement = ref.current

        const scrollCallback = scroll(
            (latestProgress) => {
                progress.current = latestProgress
                frame.postRender(startAnimation)
            },
            {
                container: getNearestScrollContainerForFramerMotion(domElement),
                axis: "x",
            }
        )

        return scrollCallback
    }, [animate])

    return (
        <>
            <p>scroll horizontally to see the choppiness</p>
            <div style={container}>
                <motion.div style={box} ref={ref}>
                    <span style={{ color: "white" }}>NEW</span>
                </motion.div>
                {Array(80)
                    .fill(0)
                    .map(() => (
                        <div style={{ visibility: "hidden" }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Feugiat sed lectus vestibulum
                            mattis. Id consectetur purus ut faucibus pulvinar
                            elementum integer enim neque. Metus vulputate eu
                            scelerisque felis imperdiet. Massa massa ultricies
                            mi quis hendrerit dolor magna eget est. Rhoncus
                            aenean vel elit scelerisque mauris pellentesque.
                            Volutpat est velit egestas dui id ornare arcu. Id
                            cursus metus aliquam eleifend mi in. Condimentum
                            lacinia quis vel eros donec ac. Feugiat pretium nibh
                            ipsum consequat nisl vel pretium lectus.
                        </div>
                    ))}
            </div>
        </>
    )
}

/// -----------------------------------------------------------------

/// Helpers

function getNearestScrollContainerForFramerMotion(node) {
    let currentParent = node.parentElement
    while (currentParent && currentParent !== document.body) {
        if (isOverflowing(currentParent)) {
            return currentParent
        }
        currentParent = currentParent.parentElement
    }
    return document.documentElement
}

function isOverflowing(node) {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
        return false
    }
    const style = getComputedStyle(node)
    return ["overflow", "overflow-x", "overflow-y"].some((propertyName) => {
        const value = style.getPropertyValue(propertyName)
        return value === "auto" || value === "scroll"
    })
}

/// Style

const box = {
    width: 100,
    height: 100,
    backgroundColor: "#ff0088",
    borderRadius: 5,
    position: "fixed",
    top: 100,
}

const container = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
}
