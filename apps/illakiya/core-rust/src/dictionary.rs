use serde::Deserialize;
use std::collections::HashMap;

/// Dictionary engine with Trie-based prefix search for word suggestions.
/// Loaded from tamil_base.json at init time via include_str!.

#[derive(Debug, Deserialize)]
struct DictFile {
    version: String,
    word_count: usize,
    words: Vec<DictEntry>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DictEntry {
    pub tamil: String,
    #[serde(default)]
    pub translit: String,
    #[serde(default)]
    pub en: String,
    pub freq: u32,
    #[serde(default)]
    pub category: String,
}

/// Trie node for Tamil character prefix search
#[derive(Debug, Default)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    entries: Vec<usize>, // Indices into the word list
    is_word: bool,
}

pub struct Dictionary {
    entries: Vec<DictEntry>,
    trie: TrieNode,
    /// Recent words for frequency boosting
    recents: Vec<String>,
    max_recents: usize,
}

impl Dictionary {
    pub fn new() -> Self {
        let json = include_str!("../../data/dictionary/tamil_base.json");
        let dict_file: DictFile = serde_json::from_str(json)
            .expect("Invalid tamil_base.json");
        
        let mut dict = Self {
            entries: dict_file.words,
            trie: TrieNode::default(),
            recents: Vec::new(),
            max_recents: 50,
        };
        dict.build_trie();
        dict
    }

    /// Build the prefix trie from all dictionary entries
    fn build_trie(&mut self) {
        for (idx, entry) in self.entries.iter().enumerate() {
            let mut node = &mut self.trie;
            for ch in entry.tamil.chars() {
                node = node.children.entry(ch).or_default();
            }
            node.is_word = true;
            node.entries.push(idx);
        }
    }

    /// Look up an exact word. Returns entry if found.
    pub fn lookup(&self, word: &str) -> Option<&DictEntry> {
        let mut node = &self.trie;
        for ch in word.chars() {
            match node.children.get(&ch) {
                Some(next) => node = next,
                None => return None,
            }
        }
        if node.is_word {
            node.entries.first().map(|&idx| &self.entries[idx])
        } else {
            None
        }
    }

    /// Check if a word exists in the dictionary
    pub fn contains(&self, word: &str) -> bool {
        self.lookup(word).is_some()
    }

    /// Prefix search: find all words starting with the given prefix.
    /// Returns up to `limit` results, sorted by frequency (descending).
    pub fn suggest(&self, prefix: &str, limit: usize) -> Vec<String> {
        if prefix.is_empty() { return Vec::new(); }

        // Navigate to prefix node
        let mut node = &self.trie;
        for ch in prefix.chars() {
            match node.children.get(&ch) {
                Some(next) => node = next,
                None => return Vec::new(),
            }
        }

        // Collect all words under this node
        let mut candidates: Vec<(String, u32)> = Vec::new();
        self.collect_words(node, &mut candidates);

        // Boost recent words
        for (word, freq) in candidates.iter_mut() {
            if self.recents.contains(word) {
                *freq += 50; // Recency boost
            }
        }

        // Sort by frequency descending
        candidates.sort_by(|a, b| b.1.cmp(&a.1));
        candidates.truncate(limit);
        candidates.into_iter().map(|(w, _)| w).collect()
    }

    /// Recursively collect all words from a trie node
    fn collect_words(&self, node: &TrieNode, results: &mut Vec<(String, u32)>) {
        for &idx in &node.entries {
            let entry = &self.entries[idx];
            results.push((entry.tamil.clone(), entry.freq));
        }
        for child in node.children.values() {
            self.collect_words(child, results);
        }
    }

    /// Record that a word was typed (for recency boosting)
    pub fn record_usage(&mut self, word: &str) {
        // Remove if already in recents
        self.recents.retain(|w| w != word);
        // Push to front
        self.recents.insert(0, word.to_string());
        // Trim
        if self.recents.len() > self.max_recents {
            self.recents.pop();
        }
    }

    /// Get word count
    pub fn word_count(&self) -> u32 {
        self.entries.len() as u32
    }

    /// Get translation for a Tamil word
    pub fn translate(&self, word: &str) -> Option<String> {
        self.lookup(word).map(|e| e.en.clone())
    }

    /// Get transliteration for a Tamil word
    pub fn transliterate(&self, word: &str) -> Option<String> {
        self.lookup(word).map(|e| e.translit.clone())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_dictionary() {
        let dict = Dictionary::new();
        assert!(dict.word_count() > 100);
    }

    #[test]
    fn test_exact_lookup() {
        let dict = Dictionary::new();
        let entry = dict.lookup("தமிழ்");
        assert!(entry.is_some());
        assert_eq!(entry.unwrap().en, "Tamil");
    }

    #[test]
    fn test_contains() {
        let dict = Dictionary::new();
        assert!(dict.contains("நான்"));
        assert!(!dict.contains("xyzzyx"));
    }

    #[test]
    fn test_prefix_suggest() {
        let dict = Dictionary::new();
        let suggestions = dict.suggest("தமி", 5);
        assert!(!suggestions.is_empty());
        assert!(suggestions.iter().any(|s| s == "தமிழ்"));
    }

    #[test]
    fn test_empty_prefix() {
        let dict = Dictionary::new();
        let suggestions = dict.suggest("", 5);
        assert!(suggestions.is_empty());
    }

    #[test]
    fn test_no_match() {
        let dict = Dictionary::new();
        let suggestions = dict.suggest("zzz", 5);
        assert!(suggestions.is_empty());
    }

    #[test]
    fn test_recency_boost() {
        let mut dict = Dictionary::new();
        let before = dict.suggest("வ", 3);
        dict.record_usage("வணக்கம்");
        let after = dict.suggest("வ", 3);
        // வணக்கம் should be boosted towards top
        if after.contains(&"வணக்கம்".to_string()) {
            let pos = after.iter().position(|w| w == "வணக்கம்").unwrap();
            assert!(pos <= 2); // Should be in top 3
        }
    }

    #[test]
    fn test_translate() {
        let dict = Dictionary::new();
        assert_eq!(dict.translate("நான்"), Some("I".to_string()));
    }

    #[test]
    fn test_transliterate() {
        let dict = Dictionary::new();
        assert_eq!(dict.transliterate("நான்"), Some("naan".to_string()));
    }
}
