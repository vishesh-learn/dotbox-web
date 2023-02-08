window.onload = () => {
  document.querySelector(".share-button").addEventListener("click",
    () => window.open(`${onAppStore.googlePlay}${onAppStore.packageName}`)
  );

  document.querySelector("#startButton").addEventListener("click",
    () => window.location.href = `${pages.setBoard}`
  );

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}`
  );

  setTabIndex();
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}
