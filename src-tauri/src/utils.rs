use tauri::Manager;

use crate::APP_HANDLE;

pub fn send_text(text: String) {
    match APP_HANDLE.get() {
        Some(handle) => handle.emit_all("change-text", text).unwrap_or_default(),
        None => {}
    }
}
