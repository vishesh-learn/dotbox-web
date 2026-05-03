export class ElementGuide {
    static currentIndex = -1;
    static data: ElementGuide[] = [];

    elementSelector: string;
    title: string;
    instruction: string;

    constructor(elementSelector, title, instruction?) {
        this.elementSelector = elementSelector;
        this.title = title;
        this.instruction = instruction;
    }

    get element() {
        const elements = document.querySelectorAll(this.elementSelector);

        for (const element of elements) {
            const boundingClientRect = element.getBoundingClientRect();

            if (boundingClientRect.top >= 50 && boundingClientRect.bottom <= innerHeight) {
                return element;
            }
        }

        return elements.length ? elements[0] : null;
    }

    activate() {
        if (this.element) {
            highlightElement(this.element);

            elementTooltip(this.element, this.title, this.instruction);
        }
    }

    static refreshState() {
        removeHighlight();

        if (!ElementGuide.data.length) {
            return false;
        }

        if (ElementGuide.currentIndex >= 0 && ElementGuide.currentIndex < ElementGuide.data.length) {
            ElementGuide.data[ElementGuide.currentIndex].activate();
        } else {
            ElementGuide.deactivate();
        }
    }

    static nextState() {
        if (ElementGuide.currentIndex < ElementGuide.data.length) {
            ElementGuide.currentIndex++;
        } else {
            ElementGuide.currentIndex = 0;
        }

        ElementGuide.refreshState();
    }

    static deactivate() {
        removeHighlight();

        removeTooltip();

        ElementGuide.currentIndex = -1;
    }
}

function elementTooltip(element, title, instruction) {
    const gap = 5;

    const container = document.querySelector("body");

    const containerBoundingClientRect = container.getBoundingClientRect();
    const elementBoundingClientRect = element.getBoundingClientRect();

    let tooltip = document.querySelector(".tooltip");

    if (!tooltip) {
        tooltip = newTooltipUI(title, instruction);
    } else {
        const titleElement = document.querySelector<HTMLElement>(".tooltip .title");
        if (titleElement && title) {
            titleElement.innerText = title;
        }

        const instructionElement = document.querySelector<HTMLElement>(".tooltip .instruction");
        if (instructionElement && instruction) {
            instructionElement.innerText = instruction;
        }
    }

    const tooltipBoundingClientRect = tooltip.getBoundingClientRect();

    const isSpaceOnTop = elementBoundingClientRect.top - tooltipBoundingClientRect.height - gap > containerBoundingClientRect.top;
    const isSpaceOnBottom = elementBoundingClientRect.bottom + tooltipBoundingClientRect.height + gap < containerBoundingClientRect.height;

    tooltip.classList.remove("bottom", "top", "middle");

    const tooltipEl = tooltip as HTMLElement;

    if (isSpaceOnTop) {
        tooltipEl.style.top = `${elementBoundingClientRect.top - tooltipBoundingClientRect.height - gap}px`;

        tooltip.classList.add("bottom");
    } else if (isSpaceOnBottom) {
        tooltipEl.style.top = `${elementBoundingClientRect.bottom + gap}px`;

        tooltip.classList.add("top");
    } else {
        tooltipEl.style.top = `${(elementBoundingClientRect.top
            + Math.round(elementBoundingClientRect.height / 2))
            - Math.round(tooltipBoundingClientRect.height / 2)}px`;

        tooltip.classList.add("middle");
    }

    const isSpaceOnRight = elementBoundingClientRect.right + tooltipBoundingClientRect.width + gap < containerBoundingClientRect.width;
    const isSpaceOnLeft = elementBoundingClientRect.left - tooltipBoundingClientRect.width - gap > containerBoundingClientRect.left;

    tooltip.classList.remove("left", "right", "center");

    if (isSpaceOnRight) {
        tooltipEl.style.left = `${elementBoundingClientRect.right + gap}px`;

        tooltip.classList.add("left");
    } else if (isSpaceOnLeft) {
        tooltipEl.style.left = `${elementBoundingClientRect.left - tooltipBoundingClientRect.width - gap}px`;

        tooltip.classList.add("right");
    } else {
        tooltipEl.style.left = `${(elementBoundingClientRect.left
            + Math.round(elementBoundingClientRect.width / 2))
            - Math.round(tooltipBoundingClientRect.width / 2)}px`;

        tooltip.classList.add("center");
    }
}

function newTooltipUI(title: string, instruction: string) {
    const container = document.querySelector("body");

    const tooltip = document.createElement("div");
    tooltip.classList = "tooltip";

    const titleElement = document.createElement("div");
    titleElement.classList = "title";
    tooltip.append(titleElement);

    const instructionElement = document.createElement("div");
    instructionElement.classList = "instruction";

    tooltip.append(instructionElement);

    if (title) {
        titleElement.innerText = title;
    }

    if (instruction) {
        instructionElement.innerText = instruction;
    }

    const actionButtons = document.createElement("div");
    actionButtons.classList = "actionButtons";
    tooltip.append(actionButtons);

    const skipButton = document.createElement("button");
    skipButton.classList = "skip button";
    skipButton.innerText = "skip";
    skipButton.addEventListener("click", ElementGuide.deactivate);
    actionButtons.append(skipButton);

    const nextStateButton = document.createElement("button");
    nextStateButton.classList = "nextState button";
    nextStateButton.innerText = "ok";
    nextStateButton.addEventListener("click", ElementGuide.nextState);
    actionButtons.append(nextStateButton);

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

    tooltip.append(connectorContainer);

    container.append(tooltip);

    return tooltip;
}

function removeTooltip() {
    const tooltipElements = document.querySelectorAll(".tooltip");

    tooltipElements.forEach(tooltipElement => tooltipElement.remove());
}

function highlightElement(element) {
    const container = document.querySelector("body");
    container.classList.add("highlight");

    element.classList.add("highlight-container")

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