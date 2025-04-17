import { motion } from "framer-motion"

export const App = () => {
    return (
        <svg
            width="1000"
            height="1000"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.circle
                cx={100}
                cy={100}
                r={50}
                style={{ skew: 45 }}
                initial={{ originX: 0, rotate: 0 }}
                animate={{ originX: 1, rotate: 180 }}
                transition={{ duration: 0.2 }}
            />
            <motion.rect
                x={200}
                y={200}
                width={100}
                height={100}
                style={{ rotate: 45 }}
                initial={{ originY: 0 }}
                animate={{ originY: 2 }}
                transition={{ duration: 0.2 }}
            />
            <motion.circle
                cx={100}
                cy={100}
                r={50}
                style={{ skew: 45 }}
                initial={{ originX: 0, originY: 0, rotate: 0 }}
                animate={{ originX: 1, originY: 1, rotate: 180 }}
                transition={{ duration: 0.2 }}
                fill="red"
                id="new-transform"
            />
        </svg>
    )
}
