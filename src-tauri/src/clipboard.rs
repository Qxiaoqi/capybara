use tauri::ClipboardManager;

#[tauri::command(async)]
pub fn clipboard_command() {
    clipboard();
}

pub fn clipboard() {
    do_clipboard().unwrap();
}

pub fn do_clipboard() -> Result<(), Box<dyn std::error::Error>> {
    use crate::{APP_HANDLE, LAST_TRANSLATE_TEXT};

    let app = APP_HANDLE.get().unwrap();
    if let Ok(result) = app.clipboard_manager().read_text() {
        match result {
            Some(v) => {
                let (window, exist) = crate::windows::show_translator_window(false, false, true);
                if exist {
                    window.emit("change-text", v).unwrap_or_default();
                    *LAST_TRANSLATE_TEXT.lock() = String::new();
                } else {
                    *LAST_TRANSLATE_TEXT.lock() = v;
                }
            }
            None => {}
        }
        Ok(())
    } else {
        Err("clipboard failed".into())
    }
}
