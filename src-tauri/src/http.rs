use reqwest::header::HeaderMap;
use reqwest::{Client, RequestBuilder};
use serde_json::Value;
use std::time::Duration;

pub fn local_client() -> Client {
    Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .unwrap_or_else(|_| Client::new())
}

pub fn pvp_client() -> Client {
    Client::builder()
        .build()
        .unwrap_or_else(|_| Client::new())
}

async fn send_retry<F: Fn() -> RequestBuilder>(make: F) -> Option<Value> {
    for _ in 0..3 {
        let resp = make().send().await.ok()?;
        if resp.status().as_u16() == 429 {
            let secs = resp
                .headers()
                .get("Retry-After")
                .and_then(|v| v.to_str().ok())
                .and_then(|s| s.parse::<u64>().ok())
                .unwrap_or(5);
            tokio::time::sleep(Duration::from_secs(secs + 1)).await;
            continue;
        }
        if !resp.status().is_success() {
            return None;
        }
        return resp.json().await.ok();
    }
    None
}

pub async fn get_json_retry(url: &str, headers: HeaderMap) -> Option<Value> {
    send_retry(|| pvp_client().get(url).headers(headers.clone())).await
}

pub async fn put_json_retry(url: &str, headers: HeaderMap, body: &Value) -> Option<Value> {
    send_retry(|| pvp_client().put(url).headers(headers.clone()).json(body)).await
}
