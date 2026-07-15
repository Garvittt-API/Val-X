use crate::lockfile::Lockfile;
use base64::{engine::general_purpose::STANDARD, Engine};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use serde_json::Value;

#[derive(Debug, Clone)]
pub struct AuthContext {
    pub access_token: String,
    pub entitlements: String,
    pub puuid: String,
}

#[derive(Debug, PartialEq, Eq)]
pub enum AuthError {
    Http,
    Shape,
}

const CLIENT_PLATFORM: &str = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";

pub fn basic_auth_header(password: &str) -> String {
    format!("Basic {}", STANDARD.encode(format!("riot:{password}")))
}

pub fn parse_entitlements(json: &Value) -> Result<AuthContext, AuthError> {
    let field = |key: &str| {
        json.get(key)
            .and_then(|v| v.as_str())
            .map(String::from)
            .ok_or(AuthError::Shape)
    };
    Ok(AuthContext {
        access_token: field("accessToken")?,
        entitlements: field("token")?,
        puuid: field("subject")?,
    })
}

pub fn pvp_headers(ctx: &AuthContext, client_version: &str) -> HeaderMap {
    let mut headers = HeaderMap::new();
    if let Ok(val) = HeaderValue::from_str(&format!("Bearer {}", ctx.access_token)) {
        headers.insert(AUTHORIZATION, val);
    }
    if let Ok(val) = HeaderValue::from_str(&ctx.entitlements) {
        headers.insert("X-Riot-Entitlements-JWT", val);
    }
    if let Ok(val) = HeaderValue::from_str(client_version) {
        headers.insert("X-Riot-ClientVersion", val);
    }
    headers.insert(
        "X-Riot-ClientPlatform",
        HeaderValue::from_static(CLIENT_PLATFORM),
    );
    headers
}

pub async fn fetch_auth(lf: &Lockfile) -> Result<AuthContext, AuthError> {
    let url = format!("https://127.0.0.1:{}/entitlements/v1/token", lf.port);
    let resp = crate::http::local_client()
        .get(url)
        .header(AUTHORIZATION, basic_auth_header(&lf.password))
        .send()
        .await
        .map_err(|_| AuthError::Http)?;
    let body: Value = resp.json().await.map_err(|_| AuthError::Shape)?;
    parse_entitlements(&body)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builds_basic_auth() {
        assert_eq!(basic_auth_header("pw"), "Basic cmlvdDpwdw==");
    }

    #[test]
    fn parses_entitlements() {
        let v: Value =
            serde_json::from_str(r#"{"accessToken":"AT","token":"ENT","subject":"PU"}"#).unwrap();
        let ctx = parse_entitlements(&v).unwrap();
        assert_eq!(ctx.access_token, "AT");
        assert_eq!(ctx.entitlements, "ENT");
        assert_eq!(ctx.puuid, "PU");
    }

    #[test]
    fn rejects_missing_fields() {
        let v: Value = serde_json::from_str(r#"{"accessToken":"AT"}"#).unwrap();
        assert_eq!(parse_entitlements(&v).unwrap_err(), AuthError::Shape);
    }

    #[test]
    fn builds_pvp_headers() {
        let ctx = AuthContext {
            access_token: "AT".into(),
            entitlements: "ENT".into(),
            puuid: "PU".into(),
        };
        let headers = pvp_headers(&ctx, "release-09.00");
        assert_eq!(headers["Authorization"], "Bearer AT");
        assert_eq!(headers["X-Riot-Entitlements-JWT"], "ENT");
        assert_eq!(headers["X-Riot-ClientVersion"], "release-09.00");
    }
}
