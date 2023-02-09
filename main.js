window.addEventListener("load", () => {
  document.querySelector(".share-button").addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      })
    } else {
      window.open(shareUrl)
    }
  });

  document.querySelector("#startButton").addEventListener("click",
    () => window.location.href = `${pages.setBoard}`
  );

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}`
  );

  setTabIndex();
});