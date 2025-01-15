import * as idbKeyval from "idb-keyval";


const KEY_RECENT = 'pdf-viewer-html-KEY_RECENT_PDF_FILES';
const MAX_NUM_RECORDS = 12;

export async function add_recent(itemToAdd) {
    const recent_list = await get_recent_list()
    const filtered_recent_list = [];
    for (const item of recent_list) {
        if (await item.handle.isSameEntry(itemToAdd.handle)) {
            continue;
        }
        filtered_recent_list.push(item);
    }
    filtered_recent_list.unshift(itemToAdd);
    if (filtered_recent_list.length > MAX_NUM_RECORDS) {
        filtered_recent_list.pop();
    }
    return idbKeyval.set(KEY_RECENT, filtered_recent_list);
}

export async function get_recent_list() {
    let recent_list = await idbKeyval.get(KEY_RECENT);
    if (!recent_list) {
        recent_list = [];
    }
    return recent_list;
}

export async function clear_recent_list() {
    return idbKeyval.set(KEY_RECENT, []);
}
