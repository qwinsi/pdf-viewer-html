/**
 * Resources:
 * - Progressive Web Apps: Going Offline https://developers.google.com/codelabs/pwa-training/pwa03--going-offline
 * - Languages used on the Internet https://en.wikipedia.org/wiki/Languages_used_on_the_Internet
 */

const cacheName = "cache-v1";

const languages = [
    "en-CA",
    "en-GB",
    "en-US",
    "es-AR",
    "es-CL",
    "es-ES",
    "es-MX",
    "ru",
    "de",
    "fr",
    "ja",
    "pt-BR",
    "pt-PT",
    "tr",
    "it",
    "fa",
    "nl",
    "pl",
    "zh-CN",
    "zh-TW",
    "vi",
    "id",
    "cs",
    "ko",
];

const images = [
    "altText_add.svg",
    "altText_disclaimer.svg",
    "altText_done.svg",
    "altText_spinner.svg",
    "altText_warning.svg",
    "annotation-check.svg",
    "annotation-comment.svg",
    "annotation-help.svg",
    "annotation-insert.svg",
    "annotation-key.svg",
    "annotation-newparagraph.svg",
    "annotation-noicon.svg",
    "annotation-note.svg",
    "annotation-paperclip.svg",
    "annotation-paragraph.svg",
    "annotation-pushpin.svg",
    "cursor-editorFreeHighlight.svg",
    "cursor-editorFreeText.svg",
    "cursor-editorInk.svg",
    "cursor-editorTextHighlight.svg",
    "editor-toolbar-delete.svg",
    "findbarButton-next.svg",
    "findbarButton-previous.svg",
    "gv-toolbarButton-download.svg",
    "loading-icon.gif",
    "loading.svg",
    "messageBar_closingButton.svg",
    "messageBar_warning.svg",
    "secondaryToolbarButton-documentProperties.svg",
    "secondaryToolbarButton-firstPage.svg",
    "secondaryToolbarButton-handTool.svg",
    "secondaryToolbarButton-lastPage.svg",
    "secondaryToolbarButton-rotateCcw.svg",
    "secondaryToolbarButton-rotateCw.svg",
    "secondaryToolbarButton-scrollHorizontal.svg",
    "secondaryToolbarButton-scrollPage.svg",
    "secondaryToolbarButton-scrollVertical.svg",
    "secondaryToolbarButton-scrollWrapped.svg",
    "secondaryToolbarButton-selectTool.svg",
    "secondaryToolbarButton-spreadEven.svg",
    "secondaryToolbarButton-spreadNone.svg",
    "secondaryToolbarButton-spreadOdd.svg",
    "toolbarButton-bookmark.svg",
    "toolbarButton-currentOutlineItem.svg",
    "toolbarButton-download.svg",
    "toolbarButton-editorFreeText.svg",
    "toolbarButton-editorHighlight.svg",
    "toolbarButton-editorInk.svg",
    "toolbarButton-editorStamp.svg",
    "toolbarButton-menuArrow.svg",
    "toolbarButton-openFile.svg",
    "toolbarButton-pageDown.svg",
    "toolbarButton-pageUp.svg",
    "toolbarButton-presentationMode.svg",
    "toolbarButton-print.svg",
    "toolbarButton-search.svg",
    "toolbarButton-secondaryToolbarToggle.svg",
    "toolbarButton-sidebarToggle.svg",
    "toolbarButton-viewAttachments.svg",
    "toolbarButton-viewLayers.svg",
    "toolbarButton-viewOutline.svg",
    "toolbarButton-viewThumbnail.svg",
    "toolbarButton-zoomIn.svg",
    "toolbarButton-zoomOut.svg",
    "treeitem-collapsed.svg",
    "treeitem-expanded.svg",
]

const precacheResources = [
    "/",
    "/index.html",
    "/viewer.mjs",
    "/viewer.css",
    "/script.js",
    "/main.js",
    "/main.css",
    "/manifest.json",
    "/favicon.png",
    "/locale/locale.json",
    ...languages.map(lang => `/locale/${lang}/viewer.ftl`),
    ...images.map(image => `/images/${image}`),
];

self.addEventListener("install", (event) => {
    console.info("[Service Worker] Caching resources...");
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

function cleanResponse(response) {
    const clonedResponse = response.clone();

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise = 'body' in clonedResponse ?
        Promise.resolve(clonedResponse.body) :
        clonedResponse.blob();

    return bodyPromise.then((body) => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        });
    });
}

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                if (cachedResponse.redirected === true && event.request.url.endsWith("/index.html")) {
                    // A cached response of **/index.html may contain a mark of redirected=true,
                    // which will cause browser to block the response due to security concerns.
                    // So we need to somehow remove this mark from the response.
                    // https://stackoverflow.com/questions/45434470/only-in-chrome-service-worker-a-redirected-response-was-used-for-a-reque
                    return cleanResponse(cachedResponse);
                }
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
