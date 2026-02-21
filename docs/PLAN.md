# Implementation Plan: Yazhi Tamil Keyboard

## Phase 1: Layout Specification & Design (Completed)
- [x] **Finalize Vowel (Uyir) Mapping:** Confirm the Kuril-Nedil pairs and their positions. Make Aytham (ஃ) and Au (ஔ) special keys.
- [x] **Finalize Consonant (Mei) Mapping:** Decide on the grouping (Vallinam, Mellinam, Idaiyinam) and their physical layout on the keyboard.
- [x] **Define Interaction Model:** 
  - Tap: Base character (Kuril / Base Consonant).
  - Long Press / Swipe Up: Paired character (Nedil / Harder sound).
- [x] **Uyirmei (Combined) Logic:** Define how consonants and vowels combine (e.g., typing `க்` + `அ` = `க`). Ensure Nedil combinations are fully supported.
- [x] **Grantha Letters:** Add Grantha letters (ஜ, ஷ, ஸ, ஹ, க்ஷ, ஸ்ரீ) to the top layer with a functional toggle option.

## Phase 2: Web Prototype (Testing Ground) (Current)
- [x] **Setup Web Project:** Create a simple HTML/CSS/JS application.
- [x] **Render Virtual Keyboard:** Build the UI based on the Phase 1 layout spec.
- [x] **Implement Input Engine:** Write the JavaScript logic to handle taps, long presses, and Uyirmei combinations.
- [x] **Reliability & Caching:** Add Service Workers for offline support (PWA) and LocalStorage to persist typed text.
- [x] **Tamil Suggestion Bar:** Implement a UI bar above the keyboard for word suggestions.
- [ ] **Memory Hub:** Create a local storage mechanism to remember frequently typed words and user corrections.
- [x] **Navigation:** Add arrow keys for easy cursor movement within the text area.
- [ ] **Tutorial Flow:** Build an interactive onboarding tutorial for beginners to learn the PM0100 layout principles.
- [ ] **Testing & Feedback:** Share the web prototype with users to gather feedback on typing speed and intuitiveness.

## Phase 3: Core Engine, Adhan & Configuration
- [ ] **Define Layout Schema:** Create a standard JSON/YAML format to represent the keyboard layout and rules.
- [ ] **Develop Core Engine:** Build a platform-agnostic core engine (e.g., in Rust or TypeScript) that takes the layout schema and handles input state, combinations, and text output.
- [ ] **Adhan Integration:** Implement Adhan, a local processing and prediction engine for autocorrect, next-word suggestions, and smart typing without relying on cloud APIs.
- [ ] **Unit Testing:** Write comprehensive tests for all character combinations.

## Phase 4: Platform Integration
- [ ] **Android IME:** Develop an Android Input Method Service using Kotlin, integrating the core engine.
- [ ] **iOS Custom Keyboard:** Develop an iOS Custom Keyboard Extension using Swift.
- [ ] **Desktop (Linux/macOS/Windows):** Create standard keymap files (e.g., XKB for Linux) or a dedicated input method editor (IME) for desktop platforms.
