use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub size: Option<u64>,
}

#[wasm_bindgen]
pub struct FileManager {
    current_path: String,
}

#[wasm_bindgen]
impl FileManager {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FileManager {
        console_log!("FileManager created");
        FileManager {
            current_path: String::new(),
        }
    }

    #[wasm_bindgen]
    pub fn set_current_path(&mut self, path: &str) {
        self.current_path = path.to_string();
        console_log!("Current path set to: {}", path);
    }

    #[wasm_bindgen]
    pub fn get_current_path(&self) -> String {
        self.current_path.clone()
    }

    #[wasm_bindgen]
    pub fn validate_file_path(&self, path: &str) -> bool {
        !path.is_empty() && !path.contains("..") && !path.starts_with('/')
    }

    #[wasm_bindgen]
    pub fn get_file_extension(&self, filename: &str) -> String {
        if let Some(dot_pos) = filename.rfind('.') {
            filename[dot_pos + 1..].to_lowercase()
        } else {
            String::new()
        }
    }

    #[wasm_bindgen]
    pub fn is_text_file(&self, filename: &str) -> bool {
        let ext = self.get_file_extension(filename);
        matches!(ext.as_str(), "txt" | "js" | "ts" | "html" | "css" | "json" | "md" | "rs" | "py" | "java" | "cpp" | "c" | "xml" | "yml" | "yaml")
    }

    #[wasm_bindgen]
    pub fn sanitize_filename(&self, filename: &str) -> String {
        filename.chars()
            .map(|c| if c.is_alphanumeric() || c == '.' || c == '_' || c == '-' { c } else { '_' })
            .collect()
    }

    #[wasm_bindgen]
    pub fn get_language_from_path(&self, path: &str) -> String {
        if let Some(filename) = path.split('/').last() {
            let ext = self.get_file_extension(filename);
            match ext.as_str() {
                "js" => "javascript",
                "ts" => "typescript",
                "html" => "html",
                "css" => "css",
                "py" => "python",
                "rs" => "rust",
                "cpp" | "cc" | "cxx" => "cpp",
                "c" => "c",
                "java" => "java",
                "php" => "php",
                "rb" => "ruby",
                "go" => "go",
                "sql" => "sql",
                "xml" => "xml",
                "json" => "json",
                "md" => "markdown",
                "sh" | "bash" => "shell",
                "yml" | "yaml" => "yaml",
                _ => "plaintext"
            }
        } else {
            "plaintext"
        }.to_string()
    }

    #[wasm_bindgen]
    pub fn format_file_size(&self, size: u64) -> String {
        const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
        let mut size = size as f64;
        let mut unit_index = 0;

        while size >= 1024.0 && unit_index < UNITS.len() - 1 {
            size /= 1024.0;
            unit_index += 1;
        }

        if unit_index == 0 {
            format!("{} {}", size as u64, UNITS[unit_index])
        } else {
            format!("{:.1} {}", size, UNITS[unit_index])
        }
    }
}

#[wasm_bindgen]
pub fn process_file_content(content: &str, operation: &str) -> String {
    match operation {
        "trim" => content.trim().to_string(),
        "uppercase" => content.to_uppercase(),
        "lowercase" => content.to_lowercase(),
        "count_lines" => content.lines().count().to_string(),
        "count_words" => content.split_whitespace().count().to_string(),
        _ => content.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_file_path() {
        let fm = FileManager::new();
        assert!(fm.validate_file_path("test.txt"));
        assert!(fm.validate_file_path("folder/file.js"));
        assert!(!fm.validate_file_path("../escape.txt"));
        assert!(!fm.validate_file_path("/absolute/path"));
        assert!(!fm.validate_file_path(""));
    }

    #[test]
    fn test_get_file_extension() {
        let fm = FileManager::new();
        assert_eq!(fm.get_file_extension("test.js"), "js");
        assert_eq!(fm.get_file_extension("file.TS"), "ts");
        assert_eq!(fm.get_file_extension("noextension"), "");
    }

    #[test]
    fn test_is_text_file() {
        let fm = FileManager::new();
        assert!(fm.is_text_file("script.js"));
        assert!(fm.is_text_file("style.css"));
        assert!(fm.is_text_file("readme.md"));
        assert!(!fm.is_text_file("image.png"));
        assert!(!fm.is_text_file("binary.exe"));
    }
}
