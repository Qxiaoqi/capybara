use crate::APP_HANDLE;

// #[cfg(target_os = "macos")]
// use cocoa::appkit::NSWindow;

use log::info;
use mouse_position::mouse_position::Mouse;
use tauri::{LogicalPosition, Manager, PhysicalPosition};

pub const TRANSLATOR_WIN_NAME: &str = "translator";
pub const CONFIG_WIN_NAME: &str = "config";
pub const SCREENSHOT_WIN_NAME: &str = "screenshot";

fn get_dummy_window() -> tauri::Window {
    let app_handle = APP_HANDLE.get().unwrap();
    match app_handle.get_window("dummy") {
        Some(window) => {
            info!("Dummy window found!");
            window
        }
        None => tauri::WindowBuilder::new(
            app_handle,
            "dummy",
            tauri::WindowUrl::App("src/dummy.html".into()),
        )
        .title("Dummy")
        .visible(false)
        .build()
        .unwrap(),
    }
}

pub fn show_config_window(center: bool, set_focus: bool) -> (tauri::Window, bool) {
    let (window, exist) = get_config_window(center, set_focus);
    window.show().unwrap();
    (window, exist)
}

fn get_config_window(center: bool, set_focus: bool) -> (tauri::Window, bool) {
    let app_handle = APP_HANDLE.get().unwrap();
    let (window, exist) = match app_handle.get_window(CONFIG_WIN_NAME) {
        Some(window) => {
            window.unminimize().unwrap();
            if set_focus {
                window.set_focus().unwrap();
            }
            (window, true)
        }
        None => {
            let builder = tauri::WindowBuilder::new(
                app_handle,
                CONFIG_WIN_NAME,
                tauri::WindowUrl::App("index.html".into()),
            )
            .title("Config")
            .fullscreen(false)
            .inner_size(1000.0, 620.0)
            .min_inner_size(540.0, 600.0)
            .resizable(true)
            .skip_taskbar(false)
            .focused(false);

            (build_window(builder), false)
        }
    };

    if center {
        if !cfg!(target_os = "macos") {
            window.unminimize().unwrap();
        }
        window.center().unwrap();
    }

    (window, exist)
}

pub fn show_translator_window(
    center: bool,
    to_mouse_position: bool,
    set_focus: bool,
) -> (tauri::Window, bool) {
    let (window, exist) = get_translator_window(center, to_mouse_position, set_focus);
    window.show().unwrap();
    (window, exist)
}

pub fn get_translator_window(
    center: bool,
    to_mouse_position: bool,
    set_focus: bool,
) -> (tauri::Window, bool) {
    let current_monitor = get_current_monitor();
    let handle = APP_HANDLE.get().unwrap();
    let (window, exist) = match handle.get_window(TRANSLATOR_WIN_NAME) {
        Some(window) => {
            window.unminimize().unwrap();
            if set_focus {
                window.set_focus().unwrap();
            }
            (window, true)
        }
        None => {
            let builder = tauri::WindowBuilder::new(
                handle,
                TRANSLATOR_WIN_NAME,
                tauri::WindowUrl::App("index.html".into()),
            )
            .title("Translator")
            .fullscreen(false)
            .inner_size(1000.0, 600.0)
            .min_inner_size(540.0, 600.0)
            .resizable(true)
            .skip_taskbar(false)
            .focused(false);

            (build_window(builder), false)
        }
    };

    if to_mouse_position {
        let (mouse_logical_x, mouse_logical_y): (i32, i32) = get_mouse_location().unwrap();
        let window_physical_size = window.outer_size().unwrap();
        let scale_factor = window.scale_factor().unwrap_or(1.0);
        let mut mouse_physical_position = PhysicalPosition::new(mouse_logical_x, mouse_logical_y);
        if cfg!(target_os = "macos") {
            mouse_physical_position =
                LogicalPosition::new(mouse_logical_x as f64, mouse_logical_y as f64)
                    .to_physical(scale_factor);
        }

        let monitor_physical_size = current_monitor.size();
        let monitor_physical_position = current_monitor.position();

        let mut window_physical_position = mouse_physical_position;
        if mouse_physical_position.x + (window_physical_size.width as i32)
            > monitor_physical_position.x + (monitor_physical_size.width as i32)
        {
            window_physical_position.x = monitor_physical_position.x
                + (monitor_physical_size.width as i32)
                - (window_physical_size.width as i32);
        }
        if mouse_physical_position.y + (window_physical_size.height as i32)
            > monitor_physical_position.y + (monitor_physical_size.height as i32)
        {
            window_physical_position.y = monitor_physical_position.y
                + (monitor_physical_size.height as i32)
                - (window_physical_size.height as i32);
        }
        if !cfg!(target_os = "macos") {
            window.unminimize().unwrap();
        }
        info!("Mouse physical position: {:?}", mouse_physical_position);
        info!("Monitor physical size: {:?}", monitor_physical_size);
        info!("Monitor physical position: {:?}", monitor_physical_position);
        info!("Window physical size: {:?}", window_physical_size);
        info!("Window physical position: {:?}", window_physical_position);
        window.set_position(window_physical_position).unwrap();
    } else if center {
        if !cfg!(target_os = "macos") {
            window.unminimize().unwrap();
        }
        window.center().unwrap();
    }

    (window, exist)
}

pub fn get_current_monitor() -> tauri::Monitor {
    let window = get_dummy_window();
    let (mouse_logical_x, mouse_logical_y): (i32, i32) = get_mouse_location().unwrap();
    let scale_factor = window.scale_factor().unwrap_or(1.0);
    let mut mouse_physical_position = PhysicalPosition::new(mouse_logical_x, mouse_logical_y);
    if cfg!(target_os = "macos") {
        mouse_physical_position =
            LogicalPosition::new(mouse_logical_x as f64, mouse_logical_y as f64)
                .to_physical(scale_factor);
    }
    window
        .available_monitors()
        .map(|monitors| {
            monitors
                .iter()
                .find(|monitor| {
                    let monitor_physical_size = monitor.size();
                    let monitor_physical_position = monitor.position();
                    mouse_physical_position.x >= monitor_physical_position.x
                        && mouse_physical_position.x
                            <= monitor_physical_position.x + (monitor_physical_size.width as i32)
                        && mouse_physical_position.y >= monitor_physical_position.y
                        && mouse_physical_position.y
                            <= monitor_physical_position.y + (monitor_physical_size.height as i32)
                })
                .cloned()
        })
        .unwrap_or_else(|e| {
            eprintln!("Error get available monitors: {}", e);
            None
        })
        .or_else(|| window.current_monitor().unwrap())
        .or_else(|| window.primary_monitor().unwrap())
        .expect("No current monitor found")
}

pub fn get_mouse_location() -> Result<(i32, i32), String> {
    let position = Mouse::get_mouse_position();
    match position {
        Mouse::Position { x, y } => Ok((x, y)),
        Mouse::Error => Err("Error getting mouse position".to_string()),
    }
}

// pub fn post_process_window<R: tauri::Runtime>(window: &tauri::Window<R>) {
//     // window.set_visible_on_all_workspaces(true).unwrap();

//     let _ = window.current_monitor();

//     #[cfg(target_os = "macos")]
//     {
//         use cocoa::appkit::NSWindowCollectionBehavior;
//         use cocoa::base::id;
//         // Disable the automatic creation of "Show Tab Bar" etc menu items on macOS
//         unsafe {
//             let ns_window = window.ns_window().unwrap() as cocoa::base::id;
//             NSWindow::setAllowsAutomaticWindowTabbing_(ns_window, cocoa::base::NO);
//         }

//         let ns_win = window.ns_window().unwrap() as id;
//         unsafe {
//             let mut collection_behavior = ns_win.collectionBehavior();
//             collection_behavior |=
//                 NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces;

//             ns_win.setCollectionBehavior_(collection_behavior);
//         }
//     }
// }

pub fn build_window<'a, R: tauri::Runtime>(
    builder: tauri::WindowBuilder<'a, R>,
) -> tauri::Window<R> {
    #[cfg(target_os = "macos")]
    {
        let window = builder
            .title_bar_style(tauri::TitleBarStyle::Overlay)
            .hidden_title(true)
            .build()
            .unwrap();

        // post_process_window(&window);

        window
    }

    #[cfg(not(target_os = "macos"))]
    {
        let window = builder.transparent(true).decorations(true).build().unwrap();

        // post_process_window(&window);

        window
    }
}

pub fn show_screenshot_window() {
    let _ = get_screenshot_window();
    // window.show().unwrap();
}

pub fn get_screenshot_window() -> tauri::Window {
    let handle = APP_HANDLE.get().unwrap();
    let current_monitor = get_current_monitor();
    let dpi = current_monitor.scale_factor();
    let physical_position = current_monitor.position();
    let position: tauri::LogicalPosition<f64> = physical_position.to_logical(dpi);

    let window = match handle.get_window(SCREENSHOT_WIN_NAME) {
        Some(window) => {
            window.set_focus().unwrap();
            window
        }
        None => {
            let builder = tauri::WindowBuilder::new(
                handle,
                SCREENSHOT_WIN_NAME,
                tauri::WindowUrl::App("index.html".into()),
            )
            .title("Capybara Translate Screenshot")
            .position(position.x, position.y)
            .visible(false)
            .focused(true);

            let window = build_window(builder);
            window
        }
    };

    window.set_resizable(false).unwrap();
    window.set_skip_taskbar(true).unwrap();
    #[cfg(target_os = "macos")]
    {
        let size = current_monitor.size();
        window.set_decorations(false).unwrap();
        window.set_size(*size).unwrap();
    }

    #[cfg(not(target_os = "macos"))]
    window.set_fullscreen(true).unwrap();

    window.set_always_on_top(true).unwrap();

    window
}
