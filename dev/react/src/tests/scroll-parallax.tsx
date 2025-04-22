import { animate, scroll } from "framer-motion"
import * as React from "react"

export const App = () => {
    React.useEffect(() => {
        document.querySelectorAll(".img-container").forEach((section) => {
            const header = section.querySelector("h2")

            if (!header) return

            scroll(animate(header, { y: [-400, 400] }, { ease: "linear" }), {
                target: header,
            })
        })
    }, [])

    return (
        <>
            <section className="img-container">
                <div>
                    <div className="img-placeholder" />
                    <h2>#001</h2>
                </div>
            </section>
            <section className="img-container">
                <div>
                    <div className="img-placeholder" />
                    <h2>#002</h2>
                </div>
            </section>
            <section className="img-container">
                <div>
                    <div className="img-placeholder" />
                    <h2>#003</h2>
                </div>
            </section>
            <section className="img-container">
                <div>
                    <div className="img-placeholder" />
                    <h2>#004</h2>
                </div>
            </section>
            <section className="img-container">
                <div>
                    <div className="img-placeholder" />
                    <h2>#005</h2>
                </div>
            </section>
            <StyleSheet />
        </>
    )
}

function StyleSheet() {
    return (
        <style>{`
      html {
        scroll-snap-type: y mandatory;
    }

    .img-container {
        height: 100vh;
        scroll-snap-align: start;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .img-container > div {
        width: 300px;
        height: 400px;
        margin: 20px;
        background: var(--white);
        overflow: hidden;
    }

    .img-container .img-placeholder {
        width: 300px;
        height: 400px;
        background-color: #000;
    }

    .img-container h2 {
        color: var(--accent);
        margin: 0;
        font-family: "Azeret Mono", monospace;
        font-size: 50px;
        font-weight: 700;
        letter-spacing: -3px;
        line-height: 1.2;
        position: absolute;
        display: inline-block;
        top: calc(50% - 25px);
        left: calc(50% + 120px);
        width: 100px;
        height: 100px;
        background-color: #000;
    }

    .progress {
        position: fixed;
        left: 0;
        right: 0;
        height: 5px;
        background: var(--accent);
        bottom: 50px;
        transform: scaleX(0);
    }
  `}</style>
    )
}
