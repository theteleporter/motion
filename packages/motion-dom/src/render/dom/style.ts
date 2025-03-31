export const style = {
    set: (element: HTMLElement | SVGElement, name: string, value: string) => {
        const isCSSVar = name.startsWith("--")

        isCSSVar
            ? element.style.setProperty(name, value)
            : (element.style[name as any] = value)
    },
    get: (element: HTMLElement | SVGElement, name: string) => {
        const isCSSVar = name.startsWith("--")

        return isCSSVar
            ? element.style.getPropertyValue(name)
            : element.style[name as any]
    },
}
