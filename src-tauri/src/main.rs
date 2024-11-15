// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod clipboard;
mod config;
mod hotkey;
mod ocr;
mod selection;
mod text;
mod user;
mod windows;

use crate::clipboard::clipboard_command;
use crate::hotkey::register_shortcut_by_frontend;
use crate::ocr::{cut_image, finish_ocr, ocr_command, screenshot};
use crate::selection::selection_command;
use crate::text::{get_last_translate_text, text_command};
use crate::user::open_config_command;

use config::{init_config, reload_store};
use hotkey::register_shortcut;
use log::warn;
use once_cell::sync::OnceCell;
use parking_lot::Mutex;
use sysinfo::{CpuExt, System, SystemExt};
use tauri::AppHandle;

pub static APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();
pub static CPU_VENDOR: Mutex<String> = Mutex::new(String::new());
pub static LAST_TRANSLATE_TEXT: Mutex<String> = Mutex::new(String::new());

fn main() {
    let mut sys = System::new();
    sys.refresh_cpu(); // Refreshing CPU information.
    if let Some(cpu) = sys.cpus().first() {
        let vendor_id = cpu.vendor_id().to_string();
        *CPU_VENDOR.lock() = vendor_id;
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs_watch::init())
        .setup(move |app| {
            APP_HANDLE.get_or_init(|| app.handle().clone());
            // Init Config
            init_config(app);

            // Register Global Shortcut
            match register_shortcut("all") {
                Ok(()) => {}
                Err(e) => {
                    warn!("Register Global error: {:?}", e);
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            reload_store,
            ocr_command,
            get_last_translate_text,
            text_command,
            clipboard_command,
            selection_command,
            register_shortcut_by_frontend,
            open_config_command,
            screenshot,
            cut_image,
            finish_ocr
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
