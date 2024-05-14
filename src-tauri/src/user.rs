#[tauri::command(async)]
pub fn open_config_command() {
    open_config().unwrap();
}

pub fn open_config() -> Result<(), Box<dyn std::error::Error>> {
    crate::windows::show_config_window(false, true);
    Ok(())
}
