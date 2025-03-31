export const style = {
    set: (
        element: HTMLElement | SVGElement,
        name: string,
        value: string | number
    ) => {
        const isCSSVar = name.startsWith("--")

        isCSSVar
            ? element.style.setProperty(name, value as string)
            : (element.style[name as any] = value as string)
    },
    get: (element: HTMLElement | SVGElement, name: string) => {
        const isCSSVar = name.startsWith("--")

        return isCSSVar
            ? element.style.getPropertyValue(name)
            : element.style[name as any]
    },
}
