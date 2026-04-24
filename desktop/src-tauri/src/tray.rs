use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

pub fn setup(app: &AppHandle) -> tauri::Result<()> {
    let show_menu = MenuItemBuilder::new("Show Colony").id("show").build(app)?;
    let feed_menu = MenuItemBuilder::new("Open Activity Feed").id("feed").build(app)?;
    let inbox_menu = MenuItemBuilder::new("Open Lead Inbox").id("inbox").build(app)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let quit_menu = MenuItemBuilder::new("Quit Colony").id("quit").build(app)?;

    let tray_menu = MenuBuilder::new(app)
        .items(&[&show_menu, &feed_menu, &inbox_menu, &separator, &quit_menu])
        .build()?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&tray_menu)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "feed" => navigate_to(app, "/colony"),
            "inbox" => navigate_to(app, "/colony/inbox"),
            "quit" => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let is_visible = window.is_visible().unwrap_or(false);
                    if is_visible {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

fn navigate_to(app: &AppHandle, path: &str) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
        let _ = window.eval(&format!("window.location.href = '{}';", path));
    }
}
