window.onload = () => {
  document.querySelector("#startButton")
  .addEventListener(
    "click",
    () => window.location.href = `${pages.setBoard}/index.html`
  );
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}
