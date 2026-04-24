use tauri::{AppHandle, Manager};
use tauri_plugin_deep_link::DeepLinkExt;

pub fn register_deep_link_handler(app: &AppHandle) {
    let handle = app.clone();
    app.deep_link().on_open_url(move |event| {
        for url in event.urls() {
            if url.host_str() == Some("auth") {
                if let Some(window) = handle.get_webview_window("main") {
                    let token = url
                        .query_pairs()
                        .find(|(k, _)| k == "token")
                        .map(|(_, v)| v.to_string())
                        .unwrap_or_default();
                    let js = format!(
                        "window.postMessage({{ type: 'desktop_auth', token: '{}' }}, '*');",
                        token
                    );
                    let _ = window.eval(&js);
                }
            }
        }
    });
}

#[tauri::command]
pub async fn complete_auth() -> Result<String, String> {
    Ok("pending".to_string())
}
