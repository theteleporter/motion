/**
 * Checks if an element is an HTML element in a way
 * that works across iframes
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
    return (
        element !== null &&
        typeof element === "object" &&
        "offsetHeight" in element
    )
}
