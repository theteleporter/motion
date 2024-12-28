import { memo } from "../../../framer-motion/src/utils/memo"

export const supportsScrollTimeline = memo(
    () => window.ScrollTimeline !== undefined
)
