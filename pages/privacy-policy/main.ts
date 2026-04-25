window.onload = () => {
    document.querySelector("#backButton").addEventListener("click",
        () => window.location.href = `../../${pages.indexPage}`);

    keyOnTabIndex();
}