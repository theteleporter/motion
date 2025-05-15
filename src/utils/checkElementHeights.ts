export function checkElementHeights() {
    // Get all elements on the page
    const allElements = document.querySelectorAll("*")

    // Convert NodeList to Array and filter elements that are 260px high
    const elementsWithHeight260 = Array.from(allElements).filter((element) => {
        const height = element.getBoundingClientRect().height
        return height === 260
    })

    // Log the found elements
    elementsWithHeight260.forEach((element) => {
        console.log("Found element with height 260px:", {
            element,
            tagName: element.tagName,
            className: element.className,
            id: element.id,
        })
    })

    return elementsWithHeight260
}
