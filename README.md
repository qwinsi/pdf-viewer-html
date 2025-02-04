# pdf-viewer-html

A HTML5 webpage for viewing local PDF files based on Mozilla's [PDF.js](https://github.com/mozilla/pdf.js) library.

It is tested on Chrome and Chromium-based Edge. Currently it's not working on Firefox due to lack of support for the [File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access).

## Online Demo

A static site is hosted on https://pdf-viewer-html-rho.vercel.app/ for demonstration.

## Keyboard Shortcuts

The following keyboard shortcuts are inherited from the PDF.js project.

| Keybinding  | Command                            |
| ----------- | ---------------------------------- |
| Ctrl+F      | Find                               |
| Ctrl+G      | Find the next occurrence           |
| Ctrl+=      | Zoom in                            |
| Ctrl+-      | Zoom out                           |
| Ctrl+0      | Reset Zoom level                   |
| Ctrl+S      | Download current PDF file          |
| Ctrl+O      | Open a PDF file                    |
| Ctrl+Alt+P  | Presentation Mode                  |
| Ctrl+Alt+G  | Select Page Number                 |
| R           | Rotate 90 degrees clockwise        |
| Shift+Space | Previous Page                      |
| Shift+R     | Rotate 90 degrees counterclockwise |

The following keyboard shortcuts are specifically added in this project.

| Keybinding | Command        |
| ---------- | -------------- |
| Ctrl+B     | Toggle Sidebar |

## Open-source License

GPL-3.0 License. See [LICENSE](LICENSE) for details.

## Credits

- [PDF.js](https://github.com/mozilla/pdf.js)

This project is impossible without the PDF.js library.

- [SumatraPDF](https://www.sumatrapdfreader.org/)

The UI design of the homepage is learned from SumatraPDF.