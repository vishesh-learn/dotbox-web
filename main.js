window.onload = () => {
  document.querySelector("#startButton").addEventListener("click",
    () => window.location.href = `${pages.setBoard}`
  );

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}`
  );

  setTabIndex();
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}
