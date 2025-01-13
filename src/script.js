function bind_keyboard_shortcuts() {
  // Ctrl+B to toggle sidebar
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'b') {
      window.PDFViewerApplication.pdfSidebar.toggle();
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {
    bind_keyboard_shortcuts();
});
