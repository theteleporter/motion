const isCSSVar = (name: string) => name.startsWith("--")

export const style = {
    set: (
        element: HTMLElement | SVGElement,
        name: string,
        value: string | number
    ) => {
        isCSSVar(name)
            ? element.style.setProperty(name, value as string)
            : (element.style[name as any] = value as string)
    },
    get: (element: HTMLElement | SVGElement, name: string) => {
        return isCSSVar(name)
            ? element.style.getPropertyValue(name)
            : element.style[name as any]
    },
}
