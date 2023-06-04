window.onload = () => {
    $aEL(document.querySelector("#backButton"), "click", () => window.location.href = `../${pages.home}`);

    keyOnTabIndex();
}