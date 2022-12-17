#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::thread;
mod drpc;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn enable_drpc(ns_version: String, project_name: String) {

  thread::spawn(move || {
    drpc::set_details(ns_version, project_name);
  });
  
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet, enable_drpc])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  // drpc::set_details();
}
