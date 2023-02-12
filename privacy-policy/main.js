window.onload = () => {
    $aEL($("#backButton"), "click", () => window.location.href = `../${pages.home}`);

    keyOnTabIndex();
}