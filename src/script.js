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
}


document.addEventListener('DOMContentLoaded', function () {
    void set_custom_background_color();
    bind_keyboard_shortcuts();
});
