window.onload = () => {
    document.querySelector("#backButton")
        .addEventListener("click", () => window.history.back());

    keyOnTabIndex();
}
