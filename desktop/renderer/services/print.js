import { ipcRenderer } from "electron";

export function printDoc(url, { printer, pages = [], paperSize = "A4", colorScheme = "monochrom", copies = 1, orientation = "portrait" }) {
    const validURL = new URL(url);

    ipcRenderer.send('print_doc',{ url: validURL.href, options: {
        printer,
        monochrome: colorScheme === "monochrom",
        paperSize,
        copies,
        orientation
    }});
}