window.onload = () => {
  document.querySelector("#startButton").addEventListener("click",
    () => window.location.href = `${pages.setBoard}/index.html`
  );

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}/index.html`
  );

  setTabIndex();
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}
