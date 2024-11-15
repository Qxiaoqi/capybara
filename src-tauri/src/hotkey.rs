use crate::clipboard::clipboard;
use crate::config::{get, set};
use crate::ocr::ocr;
use crate::selection::selection;
use crate::text::text;
use crate::APP_HANDLE;
use log::{info, warn};
use tauri::{AppHandle, GlobalShortcutManager};

fn register<F>(app_handle: &AppHandle, name: &str, handler: F, key: &str) -> Result<(), String>
where
    F: Fn() + Send + 'static,
{
    let hotkey = {
        if key.is_empty() {
            match get(name) {
                Some(v) => v.as_str().unwrap().to_string(),
                None => {
                    set(name, "");
                    String::new()
                }
            }
        } else {
            key.to_string()
        }
    };

    if !hotkey.is_empty() {
        match app_handle
            .global_shortcut_manager()
            .register(hotkey.as_str(), handler)
        {
            Ok(()) => {
                info!("Registered global shortcut: {} for {}", hotkey, name);
            }
            Err(e) => {
                warn!("Failed to register global shortcut: {} {:?}", hotkey, e);
                return Err(e.to_string());
            }
        };
    }
    Ok(())
}

// Register global shortcuts
pub fn register_shortcut(shortcut: &str) -> Result<(), String> {
    let app_handle = APP_HANDLE.get().unwrap();
    match shortcut {
        "hotkey_selection_translate" => {
            register(app_handle, "hotkey_selection_translate", selection, "")?
        }
        "hotkey_clipboard_translate" => {
            register(app_handle, "hotkey_clipboard_translate", clipboard, "")?
        }
        "hotkey_input_translate" => register(app_handle, "hotkey_input_translate", text, "")?,
        "hotkey_ocr_translate" => register(app_handle, "hotkey_ocr_translate", ocr, "")?,
        "all" => {
            register(app_handle, "hotkey_selection_translate", selection, "")?;
            register(app_handle, "hotkey_clipboard_translate", clipboard, "")?;
            register(app_handle, "hotkey_input_translate", text, "")?;
            register(app_handle, "hotkey_ocr_translate", ocr, "")?;
        }
        _ => {}
    }
    Ok(())
}

#[tauri::command]
pub fn register_shortcut_by_frontend(name: &str, shortcut: &str) -> Result<(), String> {
    let app_handle = APP_HANDLE.get().unwrap();
    match name {
        "hotkey_selection_translate" => register(
            app_handle,
            "hotkey_selection_translate",
            selection,
            shortcut,
        )?,
        "hotkey_clipboard_translate" => register(
            app_handle,
            "hotkey_clipboard_translate",
            clipboard,
            shortcut,
        )?,
        "hotkey_input_translate" => register(app_handle, "hotkey_input_translate", text, shortcut)?,
        "hotkey_ocr_translate" => register(app_handle, "hotkey_ocr_translate", ocr, shortcut)?,
        _ => {}
    }
    Ok(())
}
