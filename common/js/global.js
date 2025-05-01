addEventListener("load", () => {
  const title = document.querySelector("title");

  let titleText = [title.innerText, window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof titleText == "string") {
    title.innerText = titleText;
  }

  Version.updateVersionUI();

  addEventListener("resize", ElementGuide.refreshState);
});

function keyOnTabIndex() {
  document.querySelectorAll("[tabindex]").forEach(keyOnElement);
}

function keyOnElement(element) {
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

function difference(a, b) { return Math.abs(a - b); }

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDotRadius() {
  let dotRadius = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--dotRadius').trim().replace(/\D/g, '')
  ) || 0;

  const accountForIncreasingOutlineOffset = 1;

  const totalRadius = dotRadius + accountForIncreasingOutlineOffset;

  return totalRadius;
}

function getScrollbarSize() {
  return Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--scrollbarSize').trim().replace(/\D/g, '')
  ) || 0;
}

function getComputedSize(element) {

  let widthValue = getComputedStyle(element, null)
    .getPropertyValue("width");

  let width = Number(widthValue.match(/^\d+/)?.[0] || 0);

  let heightValue = getComputedStyle(element, null)
    .getPropertyValue("height");

  let height = Number(heightValue.match(/^\d+/)?.[0] || 0);

  return { width, height };
}

function loadingStartUI() {
  document.querySelector("body").classList.add("loading-container");
}

function loadingEndUI() {
  document.querySelector("body").classList.remove("loading-container");
}

// window.onerror = (message, source, lineno, colno, error) => {
//   document.querySelector("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;
// }