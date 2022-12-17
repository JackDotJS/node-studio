use std::{thread, time::Duration};

use discord_rich_presence::{
  activity::{self, Activity, Assets, Timestamps},
  DiscordIpc, DiscordIpcClient,
};

pub fn set_details(ns_version: String, project_name: String) {
  let mut client = DiscordIpcClient::new("998040133829922817").expect("Discord auth error");

  // this is required to maintain a connection.
  loop {
    if client.connect().is_ok() {
      break;
    }
  }

  loop {

    let large_text = format!("v{}", &ns_version);

    let assets = Assets::new()
      .large_image("nodestudio")
      .large_text(large_text.as_str());

    let details = format!("Working on {}", &project_name);
    let activity = Activity::new()
      .details(details.as_str())
      .assets(assets);

    if client.set_activity(activity).is_err() && client.reconnect().is_ok() {
      continue;
    }

    thread::sleep(Duration::from_secs(10));
  }
}
