#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod menu;
mod notifications;
mod tray;

fn main() {
    env_logger::init();

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .setup(|app| {
            tray::setup(app.handle())?;
            menu::setup(app.handle())?;
            auth::register_deep_link_handler(app.handle());

            let handle = app.handle().clone();
            tokio::spawn(async move {
                notifications::poll_loop(handle).await;
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            notifications::mark_notification_seen,
            auth::complete_auth,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Colony");
}
