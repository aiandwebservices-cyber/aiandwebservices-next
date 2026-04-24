use serde::Deserialize;
use std::time::Duration;
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

#[derive(Deserialize, Debug, Clone)]
struct NotificationEvent {
    id: String,
    kind: String,
    title: String,
    body: String,
    drill_url: Option<String>,
}

pub async fn poll_loop(app: AppHandle) {
    let mut last_poll = chrono::Utc::now().to_rfc3339();

    loop {
        tokio::time::sleep(Duration::from_secs(60)).await;

        match fetch_events(&last_poll).await {
            Ok(events) => {
                for event in &events {
                    show_notification(&app, event);
                }
                if !events.is_empty() {
                    last_poll = chrono::Utc::now().to_rfc3339();
                }
            }
            Err(e) => {
                log::warn!("notification poll failed: {}", e);
            }
        }
    }
}

async fn fetch_events(since: &str) -> Result<Vec<NotificationEvent>, reqwest::Error> {
    let url = format!(
        "https://colony.aiandwebservices.com/api/colony/desktop/notifications?since={}",
        since
    );
    reqwest::get(&url).await?.json().await
}

fn show_notification(app: &AppHandle, event: &NotificationEvent) {
    let _ = app.notification().builder().title(&event.title).body(&event.body).show();
}

#[tauri::command]
pub async fn mark_notification_seen(_event_id: String) -> Result<(), String> {
    Ok(())
}
