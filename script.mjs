import { Table } from "./Table.mjs";
import { Background } from "./Background.mjs";

document.addEventListener('click', (event) => {
    console.log('Hello');
    if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.documentElement.requestFullscreen();
	}
});
// const page = document.documentElement;
// promise = page.requestFullscreen();


new Background(document.body);
const table = new Table(document.body, 1200, 1900);

