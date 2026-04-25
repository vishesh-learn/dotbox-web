import { ElementGuide } from '../../common/js/tooltip.js';

class Tooltip extends HTMLElement {

    static get observedAttributes() {
        return ["title", "instruction"];
    }

    constructor() {
        super();

        const tooltip = document.createElement("div");
        tooltip.classList = "tooltip";

        const titleElement = document.createElement("div");
        titleElement.classList = "title";
        tooltip.append(titleElement);

        const instructionElement = document.createElement("div");
        instructionElement.classList = "instruction";

        tooltip.append(instructionElement);

        if (this.getAttribute("title")) {
            titleElement.innerText = this.getAttribute("title");
        }

        if (this.getAttribute("instruction")) {
            instructionElement.innerText = this.getAttribute("instruction");
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

        this.append(tooltip);
    }

    render() {}

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
}

customElements.define('tool-tip', Tooltip);
