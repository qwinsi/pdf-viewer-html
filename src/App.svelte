<script>
import { onMount } from "svelte";
import { get_recent_list, add_recent, clear_recent_list } from "./recent";
import { handleLaunchFileHandles } from "@qwinsi/utilities-js/pwa";

let recentFiles = $state([]);

// return string of DataURL format of thumbnail image of the first page
// looks like "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
function get_thumbnail(pageNumber) {
    const app = window.PDFViewerApplication;
    const page_view = app.pdfViewer.getPageView(pageNumber);
    app.pdfThumbnailViewer.getThumbnail(pageNumber).setImage(page_view);
    const thumbnail_images = document.getElementsByClassName('thumbnailImage');
    if(thumbnail_images.length > 0) {
        return thumbnail_images[0].src;
    } else {
        return "no-thumbnail.svg";
    }
}


async function open_pdf_from_handle(fileHandle) {
    const app = window.PDFViewerApplication;
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    app.open({
        url: url,
        originalUrl: file.name,
    }).then(() => {
        setTimeout(function() {
            const thumbnail = get_thumbnail(0);
            add_recent({ handle: fileHandle, filename: file.name, thumbnail: thumbnail });
            console.info('[Info] Added to recent list:', file.name);
        }, 1000);
    });
}


class SwitchView {
    constructor(elementIdList) {
        this.views = elementIdList.map((id) => {
            return { id: id, element: document.getElementById(id) };
        });
    }

    switchTo(id) {
        // hidden views has class 'hidden'
        this.views.forEach((view) => {
            if (view.id === id) {
                view.element.classList.remove('hidden');
            } else {
                view.element.classList.add('hidden');
            }
        });
    }
}

const switchView = new SwitchView(['home', 'outerContainer']);


async function open_recent_pdf(item) {
    switchView.switchTo('outerContainer');
    const fileHandle = item.handle;
    if (fileHandle) {
        if(await fileHandle.queryPermission({ mode: 'read' }) !== 'granted') {
            const res = await fileHandle.requestPermission({ mode: 'read' });
            if(res !== 'granted') {
                console.info('[Info] User denied permission to read file.');
                return;
            }
        }

        open_pdf_from_handle(fileHandle);
    }
}


async function handleOpenButtonClicked() {
    try {
        if (!window.showOpenFilePicker) {
            alert(`This App cannot work on this browser.
Chrome, MS Edge or other Chromium-based browsers are supported.
It's known that this App cannot work on Firefox and Safari.
`);
            return false;
        }
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{
                description: "PDF documents",
                accept: {
                    "application/pdf": [".pdf"],
                }
            }]
        });

        switchView.switchTo('outerContainer');

        void open_pdf_from_handle(fileHandle);
        return true;
    } catch (err) {
        if (err.name === 'AbortError') {
            console.info('[Info] User canceled file picker.');
            return false;
        } else {
            throw err;
        }
    }
}

async function handleClearButtonClicked() {
    void clear_recent_list();
    recentFiles = [];
}

onMount(async function () {
    get_recent_list().then((recent_list) => {
        recentFiles = recent_list;
    });

    switchView.switchTo('home');

    // Ctrl+O to open file
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'o') {
            // Prevent default Ctrl+O behavior of viewer.mjs and browser
            e.stopPropagation();
            e.preventDefault();

            void handleOpenButtonClicked();
        }
    }, true);

    handleLaunchFileHandles(function (fileHandles) {
        switchView.switchTo('outerContainer');
        open_pdf_from_handle(fileHandles[0]);
    });
});
</script>

<main>
    <h1>PDF Viewer</h1>
    <div class="recent-nav">
        <h2>Recent Files</h2>
        <button onclick={handleClearButtonClicked}>Clear Recent List</button>
    </div>
    <div class="recent-container">
        {#each recentFiles as item}
            <div class="recent-item">
                <div class="clip-container">
                    <img class="clip" src={item.thumbnail} onclick={() => open_recent_pdf(item)} alt={item.filename} />
                </div>
                <p><span onclick={() => open_recent_pdf(item)}>{ item.filename }</span></p>
            </div>
        {/each}
    </div>
    <div>
        <button onclick={handleOpenButtonClicked}>Open a document</button>
    </div>
</main>


<style>
main {
    margin-left: 40px;
    margin-right: 40px;
    display: flex;
    flex-direction: column;
}

h1 {
    text-align: right;
    border-bottom: solid 1px;
}

.recent-nav {
    display: flex;
    justify-content: space-between;

    margin-bottom: 10px;
}

main > div {
    /* keep this div centered and aligned with .recent-container */
    width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.recent-container {
    display: grid;
    width: 800px;
    grid-template-columns: repeat(4, 200px);
}

.recent-item {
    text-align: center;
    height: 150px;
}

.recent-item div {
    height: 50%;
}

.recent-item img {
    width: 158px;
    border: solid 1px;
    border-radius: 5px;
    cursor: pointer;
}

.recent-item p {
    padding-top: 10px;

    width: 160px;
    margin-left: auto;
    margin-right: auto;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
}

button {
    border: none;
    /* show underline */
    text-decoration: underline;
    background-color: inherit;
    color: darkblue;
    font-size: medium;
    cursor: pointer;
}

@media (prefers-color-scheme: dark) {
    button {
        color: lightblue;
    }
}

/*
How can I display just a portion of an image in HTML/CSS? - Stack Overflow
https://stackoverflow.com/questions/57725/
*/
.clip-container {
    position: relative;
}

.clip {
    position: absolute;
    clip: rect(0, 160px, 100px, 0);
    left: 20px;
}

</style>