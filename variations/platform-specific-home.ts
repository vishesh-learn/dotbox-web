import { shareTitle, shareText, shareUrl } from '../common/js/variables.js';

export function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
        });
    } else {
        window.open(shareUrl);
    }
}
