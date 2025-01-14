import { get as idbKeyvalGet, set as idbKeyvalSet } from "idb-keyval";

const idbKeyval = { get: idbKeyvalGet, set: idbKeyvalSet };

async function set_custom_background_color() {
    const preferences = window.PDFViewerApplication.preferences;
    let need_refresh = false;
    if (await preferences.get('forcePageColors') === false) {
        preferences.set('forcePageColors', true);
        need_refresh = true;
    }
    if (await preferences.get('pageColorsBackground') === "Canvas") {
        preferences.set('pageColorsBackground', '#a5a5a5');
        need_refresh = true;
    }
    if (need_refresh) {
        window.location.reload();
    }
}

function bind_keyboard_shortcuts() {
    // Ctrl+B to toggle sidebar
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'b') {
            window.PDFViewerApplication.pdfSidebar.toggle();
        }
    });

    // Ctrl+O to open file
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'o') {
            // Prevent default Ctrl+O behavior of viewer.mjs and browser
            e.stopPropagation();
            e.preventDefault();

            void open_pdf();
        }
    });
}


async function open_pdf() {
    console.log('open_pdf');
    const app = window.PDFViewerApplication;
    const [fileHandle] = await window.showOpenFilePicker();

    void idbKeyval.set('last_file_handle', fileHandle);

    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    app.open({
        url: url,
        originalUrl: file.name,
    });
}

async function restore_last_pdf() {
    const app = window.PDFViewerApplication;
    const fileHandle = await idbKeyval.get('last_file_handle');
    if (fileHandle) {
        if(await fileHandle.queryPermission({ mode: 'read' }) !== 'granted') {
            const res = await fileHandle.requestPermission({ mode: 'read' });
            if(res !== 'granted') {
                console.info('User denied permission to read file');
                return;
            }
        }

        const file = await fileHandle.getFile();
        const url = URL.createObjectURL(file);
        app.open({
            url: url,
            originalUrl: file.name,
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    void set_custom_background_color();
    bind_keyboard_shortcuts();
});
