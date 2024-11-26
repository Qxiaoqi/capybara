use crate::clipboard_command;
use crate::config::{get, set};
use crate::ocr_command;
use crate::text_command;
use crate::user::open_config_command;
use crate::windows::show_main_window;

use log::info;
use tauri::{
    AppHandle, CustomMenuItem, GlobalShortcutManager, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

// #[tauri::command]
pub fn update_tray(app_handle: tauri::AppHandle, mut language: String) {
    let tray_handle = app_handle.tray_handle();

    if language.is_empty() {
        language = match get("app_language") {
            Some(v) => v.as_str().unwrap().to_string(),
            None => {
                set("app_language", "zh_cn");
                "zh_cn".to_string()
            }
        };
    }

    info!("Update tray with language: {}", language);
    tray_handle
        .set_menu(match language.as_str() {
            // "en" => tray_menu_en(),
            "zh_cn" => tray_menu_zh_cn(),
            // "zh_tw" => tray_menu_zh_tw(),
            // "ja" => tray_menu_ja(),
            // "ko" => tray_menu_ko(),
            // "fr" => tray_menu_fr(),
            // "de" => tray_menu_de(),
            // "ru" => tray_menu_ru(),
            // "pt_br" => tray_menu_pt_br(),
            // "fa" => tray_menu_fa(),
            // "uk" => tray_menu_uk(),
            _ => tray_menu_zh_cn(),
        })
        .unwrap();
    #[cfg(not(target_os = "linux"))]
    tray_handle
        .set_tooltip(&format!("pot {}", app_handle.package_info().version))
        .unwrap();
}

pub fn tray_event_handler<'a>(app: &'a AppHandle, event: SystemTrayEvent) {
    match event {
        // SystemTrayEvent::LeftClick { .. } => on_tray_click(),
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "input_translate" => on_input_translate_click(),
            "clipboard_translate" => on_clipboard_translate_click(),
            "ocr_translate" => on_ocr_translate_click(),
            "main_window" => on_main_click(),
            "config_window" => on_config_click(),
            //   "check_update" => on_check_update_click(),
            //   "view_log" => on_view_log_click(app),
            "restart" => on_restart_click(app),
            "quit" => on_quit_click(app),
            _ => {}
        },
        _ => {}
    }
}

fn tray_menu_zh_cn() -> tauri::SystemTrayMenu {
    let input_translate = CustomMenuItem::new("input_translate", "文本翻译");
    let clipboard_translate = CustomMenuItem::new("clipboard_translate", "剪切板翻译");
    let ocr_translate = CustomMenuItem::new("ocr_translate", "截图 OCR 翻译");
    let main_window = CustomMenuItem::new("main_window", "主界面");
    let config_window = CustomMenuItem::new("config_window", "偏好设置");
    //   let check_update = CustomMenuItem::new("check_update", "检查更新");
    //   let view_log = CustomMenuItem::new("view_log", "查看日志");
    let restart = CustomMenuItem::new("restart", "重启应用");
    let quit = CustomMenuItem::new("quit", "退出");
    SystemTrayMenu::new()
        .add_item(input_translate)
        .add_item(clipboard_translate)
        .add_item(ocr_translate)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(main_window)
        .add_item(config_window)
        //   .add_item(check_update)
        //   .add_item(view_log)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(restart)
        .add_item(quit)
}

fn on_restart_click(app: &AppHandle) {
    info!("============== Restart App ==============");
    app.restart();
}
fn on_quit_click(app: &AppHandle) {
    app.global_shortcut_manager().unregister_all().unwrap();
    info!("============== Quit App ==============");
    app.exit(0);
}

fn on_config_click() {
    open_config_command();
}

fn on_main_click() {
    show_main_window(true, true);
}

fn on_input_translate_click() {
    text_command();
}

fn on_clipboard_translate_click() {
    clipboard_command();
}

fn on_ocr_translate_click() {
    ocr_command();
}
