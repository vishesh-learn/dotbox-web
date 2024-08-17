class ShareButton extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        const STYLE = document.createElement("style");

        STYLE.innerHTML = `
            .button {
                cursor: pointer;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }

            .button:focus, .button:focus-visible, a:focus-visible, input[type=checkbox]:focus-visible {
                outline: 2px dashed #000000;
            }

            .button:active {
                scale: 0.98;
                filter: brightness(1.1);
            }

            .line {
                stroke: var(--brown);
                stroke-width: 5;
            }

            .dot{
                fill: var(--brown);
            }
        `;

        this.shadowRoot.appendChild(STYLE);

        const SVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        SVG.setAttribute("viewBox", "0 0 50 50");
        SVG.setAttribute("preserveAspectRatio", "none");
        SVG.setAttribute("class", "button");

        SVG.appendChild(getSVGLine("32", "13.5", "18", "20.5"));
        SVG.appendChild(getSVGLine("18", "29.5", "32", "36.5"));
        SVG.appendChild(getSVGDot("41", "9"));
        SVG.appendChild(getSVGDot("9", "25"));
        SVG.appendChild(getSVGDot("41", "41"));

        this.shadowRoot.appendChild(SVG);
    }
}

customElements.define("share-button", ShareButton);

function getSVGLine(x1, y1, x2, y2) {
    let lineE = document.createElementNS('http://www.w3.org/2000/svg', "line");

    lineE.setAttribute("class", "line");

    lineE.setAttribute("x1", x1);
    lineE.setAttribute("y1", y1);
    lineE.setAttribute("x2", x2);
    lineE.setAttribute("y2", y2);

    return lineE;
}

function getSVGDot(cx, cy) {
    let dot = document.createElementNS('http://www.w3.org/2000/svg', "circle");

    dot.setAttribute("class", "dot");

    dot.setAttribute("r", "7");

    dot.setAttribute("cx", cx);
    dot.setAttribute("cy", cy);

    return dot;
}