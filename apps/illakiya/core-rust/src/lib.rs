uniffi::include_scaffolding!("illakiya");

pub mod tamil;
pub mod layout;
pub mod dictionary;
pub mod sandhi;
pub mod engine;

pub use engine::KeyboardEngine;
pub use sandhi::AdhanSandhi;
pub use dictionary::Dictionary;
