import { motion, MotionConfig } from "framer-motion"

/**
 * This test ensures different color types are animated
 * correctly with WAAPI.
 */
export const App = () => {
    return (
        <MotionConfig transition={{ duration: 1 }}>
            {/* Named color */}
            <motion.div
                className="box"
                initial={{ backgroundColor: "red" }}
                animate={{ backgroundColor: "blue" }}
            />
            {/* P3 -> RGBA */}
            <motion.div
                className="box"
                initial={{ backgroundColor: "color(display-p3 0 1 0 / 1)" }}
                animate={{ backgroundColor: "rgba(0, 0, 255, 1)" }}
            />
            {/* RGBA -> P3 */}
            <motion.div
                className="box"
                initial={{ backgroundColor: "rgba(0, 0, 255, 1)" }}
                animate={{ backgroundColor: "color(display-p3 0 1 0 / 1)" }}
            />
            {/* Computed P3 -> RGBA */}
            <motion.div
                className="box p3"
                animate={{ backgroundColor: "rgba(0, 0, 255, 1)" }}
            />
            <StyleSheet />
        </MotionConfig>
    )
}

function StyleSheet() {
    return (
        <style>{`
            .box {
                width: 100px;
                height: 100px;
                background-color: #fff;
            }

            .p3 {
                background-color: color(display-p3 0 1 0 / 1);
            }   
        `}</style>
    )
}
