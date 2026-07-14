use crate::lockfile::read_lockfile;
use futures::StreamExt;
use tokio::sync::Notify;
use tokio_tungstenite::{connect_async, tungstenite::Message};

pub async fn run_presence_socket(wake: std::sync::Arc<Notify>) {
    loop {
        let lf = match read_lockfile() {
            Ok(lf) => lf,
            Err(_) => {
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                continue;
            }
        };

        let url = format!("w://127.0.0.1:{}/ws?auth={}", lf.port, lf.password);

        let ws_stream = match connect_async(url).await {
            Ok((ws, _)) => ws,
            Err(_) => {
                tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                continue;
            }
        };

        let (_, mut read) = ws_stream.split();

        while let Some(msg) = read.next().await {
            match msg {
                Ok(Message::Text(_)) => {
                    wake.notify_one();
                }
                Ok(Message::Close(_)) => break,
                Err(_) => break,
                _ => {}
            }
        }

        tokio::time::sleep(std::time::Duration::from_secs(2)).await;
    }
}
