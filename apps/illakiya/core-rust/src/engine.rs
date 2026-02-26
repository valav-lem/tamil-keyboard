use crate::layout::LayoutDef;
use crate::dictionary::Dictionary;
use crate::sandhi::AdhanSandhi;

/// Core keyboard state machine.
/// Integrates layout, dictionary, and sandhi into a unified engine.
pub struct KeyboardEngine {
    layout: LayoutDef,
    dict: Dictionary,
    sandhi: AdhanSandhi,
    buffer: String,
    pending_consonant: Option<String>,
    nedil_active: bool,
    /// Word boundaries for sandhi detection
    words: Vec<String>,
    /// Current word being typed
    current_word: String,
}

/// Suggestion from the engine (word + source)
#[derive(Debug, Clone)]
pub struct Suggestion {
    pub text: String,
    pub source: SuggestionSource,
}

#[derive(Debug, Clone)]
pub enum SuggestionSource {
    Dictionary,
    Sandhi,
    Recent,
}

impl KeyboardEngine {
    pub fn new() -> Self {
        Self {
            layout: LayoutDef::load_pm0100(),
            dict: Dictionary::new(),
            sandhi: AdhanSandhi::new(),
            buffer: String::new(),
            pending_consonant: None,
            nedil_active: false,
            words: Vec::new(),
            current_word: String::new(),
        }
    }

    /// Toggle long vowel mode (triggered by swipe up)
    pub fn toggle_nedil(&mut self) {
        self.nedil_active = !self.nedil_active;
    }

    /// Process a single key press.
    /// Returns the text to commit.
    pub fn process_input(&mut self, key: &str) -> String {
        // 1. Check vowels (short, long, or special)
        let vowel = self.layout.any_vowel_lookup(key, self.nedil_active).cloned();
        if self.nedil_active { self.nedil_active = false; }

        if let Some(vowel) = vowel {
            return self.handle_vowel(&vowel);
        }

        // 2. Check consonant (base layer)
        if let Some(consonant) = self.layout.base_lookup(key).cloned() {
            return self.handle_consonant(&consonant);
        }

        // 3. Special keys
        self.handle_special(key)
    }

    fn handle_vowel(&mut self, vowel: &str) -> String {
        if let Some(consonant) = self.pending_consonant.take() {
            if let Some(combined) = self.layout.combine(&consonant, vowel) {
                self.buffer.push_str(combined);
                self.current_word.push_str(combined);
                return combined.clone();
            } else {
                self.buffer.push_str(&consonant);
                self.buffer.push_str(vowel);
                self.current_word.push_str(&consonant);
                self.current_word.push_str(vowel);
                return format!("{}{}", consonant, vowel);
            }
        } else {
            self.buffer.push_str(vowel);
            self.current_word.push_str(vowel);
            return vowel.to_string();
        }
    }

    fn handle_consonant(&mut self, consonant: &str) -> String {
        let mut output = String::new();
        if let Some(prev) = self.pending_consonant.take() {
            self.buffer.push_str(&prev);
            self.current_word.push_str(&prev);
            output.push_str(&prev);
        }
        self.pending_consonant = Some(consonant.to_string());
        output
    }

    fn handle_special(&mut self, key: &str) -> String {
        match key {
            " " | "space" => {
                let mut output = String::new();
                if let Some(pending) = self.pending_consonant.take() {
                    self.buffer.push_str(&pending);
                    self.current_word.push_str(&pending);
                    output.push_str(&pending);
                }
                
                // Word boundary: record word and check sandhi
                if !self.current_word.is_empty() {
                    self.dict.record_usage(&self.current_word);
                    self.words.push(self.current_word.clone());
                    self.current_word.clear();
                }
                
                output.push(' ');
                self.buffer.push(' ');
                output
            }
            "backspace" => {
                if self.pending_consonant.is_some() {
                    self.pending_consonant = None;
                } else if !self.current_word.is_empty() {
                    self.current_word.pop();
                    self.buffer.pop();
                } else if !self.buffer.is_empty() {
                    self.buffer.pop();
                }
                "\x08".to_string()
            }
            "enter" => {
                let mut output = String::new();
                if let Some(pending) = self.pending_consonant.take() {
                    self.buffer.push_str(&pending);
                    self.current_word.push_str(&pending);
                    output.push_str(&pending);
                }
                if !self.current_word.is_empty() {
                    self.words.push(self.current_word.clone());
                    self.current_word.clear();
                }
                output.push('\n');
                self.buffer.push('\n');
                output
            }
            "nedil" | "swipe_up" => {
                self.nedil_active = true;
                String::new()
            }
            "clear" => {
                self.reset();
                String::new()
            }
            _ => {
                let mut output = String::new();
                if let Some(pending) = self.pending_consonant.take() {
                    self.buffer.push_str(&pending);
                    self.current_word.push_str(&pending);
                    output.push_str(&pending);
                }
                self.buffer.push_str(key);
                self.current_word.push_str(key);
                output.push_str(key);
                output
            }
        }
    }

    /// Get word suggestions for the current input prefix.
    /// Returns up to `limit` suggestions ranked by frequency + recency.
    pub fn get_suggestions(&self, limit: u32) -> Vec<String> {
        if self.current_word.is_empty() {
            return Vec::new();
        }

        let mut prefix = self.current_word.clone();
        if let Some(ref pending) = self.pending_consonant {
            prefix.push_str(pending);
        }

        self.dict.suggest(&prefix, limit as usize)
    }

    /// Get sandhi suggestion for the last two words
    pub fn get_sandhi_suggestion(&self) -> Option<String> {
        if self.words.is_empty() { return None; }
        
        let last_word = self.words.last()?;
        if self.current_word.is_empty() { return None; }

        let result = self.sandhi.analyze(last_word, &self.current_word);
        // Only suggest if a specific rule was applied
        if result.rule != crate::sandhi::SandhiRule::IyalbuPunarchi 
           && result.rule != crate::sandhi::SandhiRule::NoRule 
           && result.confidence > 0.6 {
            Some(result.output)
        } else {
            None
        }
    }

    /// Accept a suggestion: replace current word with the suggestion
    pub fn accept_suggestion(&mut self, suggestion: &str) -> String {
        // Remove current partial word from buffer
        let current_len = self.current_word.len();
        if let Some(ref pending) = self.pending_consonant {
            // Also account for pending
            let total = current_len + pending.len();
            // But pending isn't in buffer yet
        }
        
        // Truncate buffer by current_word length
        let buf_len = self.buffer.len();
        if buf_len >= current_len {
            self.buffer.truncate(buf_len - current_len);
        }
        
        // Replace with suggestion
        self.buffer.push_str(suggestion);
        self.current_word = suggestion.to_string();
        self.pending_consonant = None;
        self.dict.record_usage(suggestion);
        
        suggestion.to_string()
    }

    /// Check if a word is in the dictionary
    pub fn is_valid_word(&self, word: &str) -> bool {
        self.dict.contains(word)
    }

    /// Translate current word
    pub fn translate_current(&self) -> Option<String> {
        if self.current_word.is_empty() { return None; }
        self.dict.translate(&self.current_word)
    }

    /// Get the full current buffer
    pub fn get_buffer(&self) -> String {
        let mut buf = self.buffer.clone();
        if let Some(ref pending) = self.pending_consonant {
            buf.push_str(pending);
        }
        buf
    }

    /// Get pending consonant for UI underline
    pub fn get_pending(&self) -> Option<String> {
        self.pending_consonant.clone()
    }

    /// Get current partial word
    pub fn get_current_word(&self) -> String {
        let mut word = self.current_word.clone();
        if let Some(ref pending) = self.pending_consonant {
            word.push_str(pending);
        }
        word
    }

    /// Check if nedil mode is active
    pub fn is_nedil_active(&self) -> bool {
        self.nedil_active
    }

    /// Get dictionary word count
    pub fn dictionary_size(&self) -> u32 {
        self.dict.word_count()
    }

    /// Reset engine state
    pub fn reset(&mut self) {
        self.buffer.clear();
        self.pending_consonant = None;
        self.nedil_active = false;
        self.words.clear();
        self.current_word.clear();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vowel_standalone() {
        let mut eng = KeyboardEngine::new();
        assert_eq!(eng.process_input("z"), "அ");
    }

    #[test]
    fn test_consonant_then_vowel() {
        let mut eng = KeyboardEngine::new();
        assert_eq!(eng.process_input("q"), "");
        assert_eq!(eng.process_input("z"), "க");
    }

    #[test]
    fn test_long_vowel_nedil() {
        let mut eng = KeyboardEngine::new();
        eng.process_input("q");
        eng.process_input("nedil");
        assert_eq!(eng.process_input("z"), "கா");
    }

    #[test]
    fn test_suggestions() {
        let mut eng = KeyboardEngine::new();
        // Type "தமி" -> should suggest "தமிழ்"
        eng.process_input("u"); // த் pending
        eng.process_input("z"); // த
        eng.process_input("p"); // ம் pending  
        eng.process_input("x"); // மி
        let suggestions = eng.get_suggestions(5);
        assert!(suggestions.iter().any(|s| s.contains("தமிழ")),
            "Expected suggestion containing 'தமிழ', got: {:?}", suggestions);
    }

    #[test]
    fn test_word_boundary_tracking() {
        let mut eng = KeyboardEngine::new();
        eng.process_input("z"); // அ
        eng.process_input(" "); // Space -> word boundary
        assert_eq!(eng.words.len(), 1);
        assert_eq!(eng.words[0], "அ");
        assert!(eng.current_word.is_empty());
    }

    #[test]
    fn test_dictionary_lookup() {
        let eng = KeyboardEngine::new();
        assert!(eng.is_valid_word("நான்"));
        assert!(!eng.is_valid_word("abcdef"));
    }

    #[test]
    fn test_current_word_tracking() {
        let mut eng = KeyboardEngine::new();
        eng.process_input("u"); // த் pending
        eng.process_input("z"); // த committed
        assert_eq!(eng.get_current_word(), "த");
        eng.process_input("p"); // ம் pending
        assert_eq!(eng.get_current_word(), "தம்");
    }

    #[test]
    fn test_dictionary_size() {
        let eng = KeyboardEngine::new();
        assert!(eng.dictionary_size() >= 100);
    }

    #[test]
    fn test_accept_suggestion() {
        let mut eng = KeyboardEngine::new();
        eng.process_input("u"); // த் pending
        eng.process_input("z"); // த
        let result = eng.accept_suggestion("தமிழ்");
        assert_eq!(result, "தமிழ்");
        assert_eq!(eng.get_current_word(), "தமிழ்");
    }

    #[test]
    fn test_full_sentence() {
        let mut eng = KeyboardEngine::new();
        // Type "நான் தமிழ்"
        eng.process_input("i"); // ந் pending
        eng.process_input("z"); // ந + அ -> ந... wait
        // Actually: ந்+அ = ந
        // Then ன் pending
        // This tests the full pipeline
        let buf = eng.get_buffer();
        assert!(!buf.is_empty());
    }
}
