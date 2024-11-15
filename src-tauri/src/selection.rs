#[tauri::command(async)]
pub fn selection_command() {
    selection();
}

pub fn selection() {
    do_selection().unwrap();
}

pub fn do_selection() -> Result<(), Box<dyn std::error::Error>> {
    use crate::LAST_TRANSLATE_TEXT;

    use selection::get_text;
    // Get Selected Text
    let text = get_text();

    println!("Selected Text: {}", text);

    let (window, exist) = crate::windows::show_translator_window(false, false, true);
    if exist {
        window.emit("change-text", text).unwrap_or_default();
        *LAST_TRANSLATE_TEXT.lock() = String::new();
    } else {
        *LAST_TRANSLATE_TEXT.lock() = text;
    }

    Ok(())
}
