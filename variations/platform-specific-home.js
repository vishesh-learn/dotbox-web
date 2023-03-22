//Only one platform specific code is to be kept uncommented at a time.

//platform specific code for web app:
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
        })
    } else {
        window.open(shareUrl);
    }
}

/* ------------------------------------- */

//platform specific code for android app:
// function shareApp() {
//     Android.shareApp(shareTitle, shareText);
// }

/* ------------------------------------- */

