// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod ocr;
mod utils;
mod windows;
mod config;

use crate::ocr::{ocr_command};

use parking_lot::Mutex;
use once_cell::sync::OnceCell;
use tauri::{AppHandle};
use sysinfo::{CpuExt, System, SystemExt};

pub static APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();
pub static CPU_VENDOR: Mutex<String> = Mutex::new(String::new());


fn main() {
    let mut sys = System::new();
    sys.refresh_cpu(); // Refreshing CPU information.
    if let Some(cpu) = sys.cpus().first() {
        let vendor_id = cpu.vendor_id().to_string();
        *CPU_VENDOR.lock() = vendor_id;
    }

    tauri::Builder::default()
        .setup(move |app| {
            APP_HANDLE.get_or_init(|| app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![ocr_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
