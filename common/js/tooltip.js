class ElementGuide {
    constructor(elementSelector, title, instruction) {
        this.elementSelector = elementSelector,
            this.title = title,
            this.instruction = instruction
    }

    get element() {
        return document.querySelector(this.elementSelector);
    }

    activate() {
        highlightElement(this.element);

        elementTooltip(this.element, this.title, this.instruction);
    }

    static deactivate() {
        removeHighlight();

        removeTooltip();
    }
}

function highlightElement(element) {
    const container = document.querySelector("body");
    container.classList.add("highlight");

    let reachedElement = false;

    while (!reachedElement) {
        const parent = element.closest(".highlight > *");
        parent.classList.add("highlight");

        reachedElement = parent == element;
    }
}

function removeHighlight() {
    const elements = document.querySelectorAll(".highlight");

    elements.forEach(element => element.classList.remove("highlight"));
}

function elementTooltip(element, title, instruction) {
    const container = document.querySelector("body");

    const containerBoundingClientRect = container.getBoundingClientRect();
    const elementBoundingClientRect = element.getBoundingClientRect();

    // const tooltipWidth = 200;
    const gap = 5;

    const tooltip = document.createElement("div");
    tooltip.classList = "tooltip highlight highlight-container";

    if (title) {
        const titleElement = document.createElement("div");
        titleElement.classList = "title";
        titleElement.innerText = title;
        tooltip.append(titleElement);
    }

    if (instruction) {
        const instructionElement = document.createElement("div");
        instructionElement.classList = "instruction";
        instructionElement.innerText = instruction;
        tooltip.append(instructionElement);
    }

    const cornerDot_TopLeft = document.createElement("div");
    cornerDot_TopLeft.classList = "corner-dots top left";
    tooltip.append(cornerDot_TopLeft);

    const cornerDot_TopRight = document.createElement("div");
    cornerDot_TopRight.classList = "corner-dots top right";
    tooltip.append(cornerDot_TopRight);

    const cornerDot_BottomLeft = document.createElement("div");
    cornerDot_BottomLeft.classList = "corner-dots bottom left";
    tooltip.append(cornerDot_BottomLeft);

    const cornerDot_BottomRight = document.createElement("div");
    cornerDot_BottomRight.classList = "corner-dots bottom right";
    tooltip.append(cornerDot_BottomRight);

    const connectorContainer = document.createElement("div");
    connectorContainer.classList = "connector-container";

    const connector = document.createElement("div");
    connector.classList = "connector";

    connectorContainer.append(connector);

    container.append(tooltip);

    const tooltipBoundingClientRect = tooltip.getBoundingClientRect();

    console.log({ tooltipBoundingClientRect, elementBoundingClientRect });

    const isSpaceOnTop = elementBoundingClientRect.top - tooltipBoundingClientRect.height - gap > containerBoundingClientRect.top;
    const isSpaceOnBottom = elementBoundingClientRect.bottom + tooltipBoundingClientRect.height + gap < containerBoundingClientRect.height;

    if (isSpaceOnTop) {
        tooltip.style.top = `${elementBoundingClientRect.top - tooltipBoundingClientRect.height - gap}px`;

        connectorContainer.classList.add("bottom");
    } else if (isSpaceOnBottom) {
        tooltip.style.top = `${elementBoundingClientRect.bottom + gap}px`;

        connectorContainer.classList.add("top");
    } else {
        tooltip.style.top = `${(elementBoundingClientRect.top
            + Math.round(elementBoundingClientRect.height / 2))
            - Math.round(tooltipBoundingClientRect.height / 2)}px`;

        connectorContainer.classList.add("middle");
    }

    const isSpaceOnRight = elementBoundingClientRect.right + tooltipBoundingClientRect.width + gap < containerBoundingClientRect.width;
    const isSpaceOnLeft = elementBoundingClientRect.left - tooltipBoundingClientRect.width - gap > containerBoundingClientRect.left;

    if (isSpaceOnRight) {
        tooltip.style.left = `${elementBoundingClientRect.right + gap}px`;

        connectorContainer.classList.add("left");
    } else if (isSpaceOnLeft) {
        tooltip.style.left = `${elementBoundingClientRect.left - tooltipBoundingClientRect.width - gap}px`;

        connectorContainer.classList.add("right");
    } else {
        tooltip.style.left = `${(elementBoundingClientRect.left
            + Math.round(elementBoundingClientRect.width / 2))
            - Math.round(tooltipBoundingClientRect.width / 2)}px`;

        connectorContainer.classList.add("center");
    }

    console.log({ isSpaceOnTop, isSpaceOnRight, isSpaceOnBottom, isSpaceOnLeft });

    tooltip.append(connectorContainer);
}

function removeTooltip() {
    const tooltipElements = document.querySelectorAll(".tooltip");

    tooltipElements.forEach(tooltipElement => tooltipElement.remove());
}