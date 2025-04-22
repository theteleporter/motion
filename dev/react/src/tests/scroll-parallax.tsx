import { animate, scroll } from "framer-motion"
import * as React from "react"

export const App = () => {
    React.useEffect(() => {
        document.querySelectorAll(".img-container").forEach((section) => {
            const mainThreadSentinel = section.querySelector(
                ".sentinel.main-thread"
            )
            const waapiSentinel = section.querySelector(".sentinel.waapi")

            if (!mainThreadSentinel || !waapiSentinel) return

            scroll(
                animate(mainThreadSentinel, {
                    y: [-400, 400],
                }),
                { target: mainThreadSentinel }
            )

            scroll(
                animate(waapiSentinel, {
                    transform: ["translateY(-400px)", "translateY(400px)"],
                }),
                { target: waapiSentinel }
            )
        })
    }, [])

    return (
        <>
            <section className="img-container">
                <div>
                    <div className="img-placeholder" />
                    <div className="main-thread sentinel" />
                    <div className="waapi sentinel" />
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

    .img-container .sentinel {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        background-color: blue;
    }

    .waapi.sentinel {
       background-color: red;
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
