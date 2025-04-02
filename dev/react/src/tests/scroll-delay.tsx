import { scroll } from "motion"
import { useAnimate } from "motion/react"
import { useEffect } from "react"

export const App = () => {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        scroll(
            animate(
                "#without-delay",
                { x: "500px" },
                { duration: 1, repeat: 2 }
            )
        )
        scroll(
            animate(
                "#with-delay",
                { transform: "translateX(500px)" },
                { delay: 0.5, duration: 1, repeat: Infinity }
            )
        )
    }, [])
    return (
        <div
            ref={scope}
            style={{
                height: "200vh",
                background: "linear-gradient(#fff, #000)",
            }}
        >
            <div style={{ position: "fixed", top: 0, left: 0 }}>
                <div
                    id="without-delay"
                    style={{ width: 100, height: 100, background: "red" }}
                />
                <div
                    id="with-delay"
                    style={{ width: 100, height: 100, background: "blue" }}
                />
            </div>
        </div>
    )
}
