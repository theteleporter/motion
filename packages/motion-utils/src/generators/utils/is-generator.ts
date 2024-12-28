import {
    AnimationGeneratorType,
    GeneratorFactory,
} from "../../../../framer-motion/src/animation/types"

export function isGenerator(
    type?: AnimationGeneratorType
): type is GeneratorFactory {
    return typeof type === "function"
}
