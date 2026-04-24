use tauri::{
    menu::{AboutMetadata, MenuBuilder, SubmenuBuilder},
    AppHandle,
};

pub fn setup(app: &AppHandle) -> tauri::Result<()> {
    let app_submenu = SubmenuBuilder::new(app, "Colony")
        .about(Some(AboutMetadata {
            name: Some("Colony".into()),
            version: Some(env!("CARGO_PKG_VERSION").into()),
            copyright: Some("© 2026 AIandWEBservices".into()),
            authors: Some(vec!["David Pulis".into()]),
            website: Some("https://aiandwebservices.com".into()),
            ..Default::default()
        }))
        .separator()
        .hide()
        .hide_others()
        .show_all()
        .separator()
        .quit()
        .build()?;

    let view_submenu = SubmenuBuilder::new(app, "View")
        .fullscreen()
        .build()?;

    let window_submenu = SubmenuBuilder::new(app, "Window")
        .minimize()
        .maximize()
        .separator()
        .close_window()
        .build()?;

    let menu = MenuBuilder::new(app)
        .items(&[&app_submenu, &view_submenu, &window_submenu])
        .build()?;

    app.set_menu(menu)?;
    Ok(())
}
