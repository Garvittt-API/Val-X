use std::path::PathBuf;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Lockfile {
    pub port: u16,
    pub password: String,
    pub protocol: String,
}

#[derive(Debug, PartialEq)]
pub enum LockfileError {
    Missing,
    Malformed,
}

pub fn parse_lockfile(contents: &str) -> Result<Lockfile, LockfileError> {
    let parts: Vec<&str> = contents.trim().split(':').collect();
    if parts.len() != 5 {
        return Err(LockfileError::Malformed);
    }
    Ok(Lockfile {
        port: parts[2].parse().map_err(|_| LockfileError::Malformed)?,
        password: parts[3].to_string(),
        protocol: parts[4].to_string(),
    })
}

pub fn lockfile_path() -> PathBuf {
    let base = std::env::var("LOCALAPPDATA").unwrap_or_default();
    PathBuf::from(base).join(r"Riot Games\Riot Client\Config\lockfile")
}

pub fn read_lockfile() -> Result<Lockfile, LockfileError> {
    let contents = std::fs::read_to_string(lockfile_path()).map_err(|_| LockfileError::Missing)?;
    parse_lockfile(&contents)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_standard_lockfile() {
        let lf = parse_lockfile("Riot Client:12345:51234:abcdEFGHpassword:https").unwrap();
        assert_eq!(lf.port, 51234);
        assert_eq!(lf.password, "abcdEFGHpassword");
        assert_eq!(lf.protocol, "https");
    }

    #[test]
    fn rejects_malformed_lockfile() {
        assert_eq!(parse_lockfile("garbage"), Err(LockfileError::Malformed));
    }

    #[test]
    fn rejects_noninteger_port() {
        assert_eq!(
            parse_lockfile("Riot Client:12345:notaport:pw:https"),
            Err(LockfileError::Malformed)
        );
    }
}
