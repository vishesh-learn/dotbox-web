import { ElementGuide } from './tooltip.js';

addEventListener("load", () => {
  const title = document.querySelector("title");

  let titleText = [title.innerText, window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof titleText == "string") {
    title.innerText = titleText;
  }

  addEventListener("resize", ElementGuide.refreshState);
});

export function keyOnTabIndex() {
  document.querySelectorAll("[tabindex]").forEach(keyOnElement);
}

export function keyOnElement(element) {
  element.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      console.log("clicking", element);

      if (element.click) {
        element.click();
      } else {
        element.dispatchEvent(new Event("click"));
      }
    }
  });
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDotRadius() {
  let dotRadius = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--dotRadius').trim().replace(/\D/g, '')
  ) || 0;

  const accountForIncreasingOutlineOffset = 1;

  const totalRadius = dotRadius + accountForIncreasingOutlineOffset;

  return totalRadius;
}

export function getScrollbarSize() {
  return Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--scrollbarSize').trim().replace(/\D/g, '')
  ) || 0;
}

export function getComputedSize(element) {

  let widthValue = getComputedStyle(element, null)
    .getPropertyValue("width");

  let width = Number(widthValue.match(/^\d+/)?.[0] || 0);

  let heightValue = getComputedStyle(element, null)
    .getPropertyValue("height");

  let height = Number(heightValue.match(/^\d+/)?.[0] || 0);

  return { width, height };
}

export function loadingStartUI() {
  document.querySelector("body").classList.add("loading-container");
}

export function loadingEndUI() {
  document.querySelector("body").classList.remove("loading-container");
}

// window.onerror = (message, source, lineno, colno, error) => {
//   document.querySelector("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;
// }
