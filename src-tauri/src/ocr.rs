use parking_lot::Mutex;

static LAST_OCR_TEXT: Mutex<String> = Mutex::new(String::new());

#[tauri::command(async)]
pub fn get_last_ocr_text() -> String {
    LAST_OCR_TEXT.lock().clone()
}

#[tauri::command(async)]
pub fn ocr_command() {
    ocr();
}

pub fn ocr() {
    do_ocr().unwrap();
}

#[cfg(target_os = "macos")]
pub fn do_ocr() -> Result<(), Box<dyn std::error::Error>> {
    use crate::{APP_HANDLE, CPU_VENDOR};

    let mut rel_path = "resources/bin/ocr_intel".to_string();
    if *CPU_VENDOR.lock() == "Apple" {
        rel_path = "resources/bin/ocr_apple".to_string();
    }

    let app = APP_HANDLE.get().unwrap();

    let bin_path = app
        .path_resolver()
        .resolve_resource(rel_path)
        .expect("failed to resolve ocr binary resource");

    let output = std::process::Command::new(bin_path)
        .args(["-l", "zh"])
        .output()
        .expect("failed to execute ocr binary");

    // check exit code
    if output.status.success() {
        // get output content
        let content = String::from_utf8(output.stdout).expect("failed to parse ocr binary output");
        let (window, exist) = crate::windows::show_translator_window(false, false, true);
        if exist {
            window
                .emit("change-text", content.clone())
                .unwrap_or_default();
            *LAST_OCR_TEXT.lock() = String::new();
        } else {
            *LAST_OCR_TEXT.lock() = content;
        }
        Ok(())
    } else {
        Err("ocr binary failed".into())
    }
}
