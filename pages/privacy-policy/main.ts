import { pages } from '../../common/js/variables.js';
import { keyOnTabIndex } from '../../common/js/global.js';

window.onload = () => {
    document.querySelector("#backButton")..addEventListener("click", () => window.history.back());

    keyOnTabIndex();
}
