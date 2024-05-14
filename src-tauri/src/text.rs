#[tauri::command(async)]
pub fn get_last_translate_text() -> String {
    use crate::LAST_TRANSLATE_TEXT;

    LAST_TRANSLATE_TEXT.lock().clone()
}

#[tauri::command(async)]
pub fn text_command() {
    text();
}

pub fn text() {
    do_text().unwrap();
}

pub fn do_text() -> Result<(), Box<dyn std::error::Error>> {
    use crate::LAST_TRANSLATE_TEXT;

    let (window, exist) = crate::windows::show_translator_window(false, false, true);
    if exist {
        window.emit("change-text", "").unwrap_or_default();
        *LAST_TRANSLATE_TEXT.lock() = String::new();
    }
    Ok(())
}
