# Project Sangam - Design Document
**Created:** 2026-02-24 | **Status:** Draft | **Version:** 1.0

---

## 1. Vision

**Project Sangam** is a comprehensive Tamil text extraction, processing, and translation pipeline that preserves the unique linguistic structure of Sangam literature (300 BCE - 300 CE). It provides:

1. **Structured Data** - Extracted poems in machine-readable format
2. **Tamil-First Parsing** - Algorithm designed for Tamil grammar (illakanam)
3. **Translation Layer** - English + Modern Tamil translations
4. **Library Format** - Standardized file structure for AI training

---

## 2. Data Sources

### Primary Sources

| Source | URL | Content |
|--------|-----|---------|
| **Project Madurai** | https://www.projectmadurai.org/ | Free Tamil texts, Sangam poems |
| **Tamil Virtual Academy** | https://www.tamilvirtualacademy.in/ | Official Tamil corpus |
| **University of Chicago** | https://uchicago.edu | Tamil digital archives |
| **Internet Archive** | https://archive.org | Historical Tamil texts |

### Target Collections

1. **Eight Anthologies (Ettuttokai)**
   - Netuntokai (400 long poems)
   - Kuruntokai (400 short poems)
   - Narrinai (400 landscape poems)
   - Purananuru (400 outer poems)
   - Ainkurunuru (500 very short poems)
   - Patirruppattu (Ten Tens)
   - Paripaatal (Religious)
   - Kalittokai (1000+ poems)

2. **Ten Songs (Pattuppaattu)**
   - 10 long ethical/nature poems

3. **Grammar Texts**
   - Tolkappiyam (1,610 sutras)
   - Nakkiranar's commentary

---

## 3. Unique Tamil Structure

### Sangam Poem Anatomy

```
┌─────────────────────────────────────┐
│  Poem Header                        │
│  - Title (கதை)                     │
│  - Poet (புலவர்)                   │
│  - Era (காலம்)                     │
│  - Theme (அகம்/புறம்)              │
├─────────────────────────────────────┤
│  Lines (வரிகள்)                     │
│  - Each line has:                   │
│    - Prosody (அளவு)                │
│    - Metaphor (உவமை)               │
│    - Sandhi (சந்தி)                │
├─────────────────────────────────────┤
│  Colophon (குறிப்பு)                │
│  - Music type (பண்)                 │
│  - Landscape (திணை)                 │
│  - Deity (தெய்வம்)                 │
└─────────────────────────────────────┘
```

### Key Tamil Linguistic Concepts

| Concept | Tamil | Description |
|---------|-------|-------------|
| **Uyir** | உயிர் | Vowels (12: 5 short + 5 long + 2 diphthongs) |
| **Mei** | மெய் | Consonants (18) |
| **Kuril** | குறிள் | Short vowels (5) |
| **Nedil** | நெடில் | Long vowels (5) |
| **Uyirmei** | உயிர்மெய் | Vowel+Consonant combos (216) |
| **Grantha** | கிரந்த | Extra characters (for Sanskrit) |
| **Aca** | அசை | Metrical foot |
| **Venpa** | வெண்பா | Prosody type |

### Landscape (Thinai) Classification

| Landscape | Tamil | Poems Type |
|-----------|-------|------------|
| **Kurinji** | குறிஞ்சி | Mountain - Love |
| **Mullai** | முல்லை | Forest - Love |
| **Marutham** | மருதம் | Farmland - Love |
| **Neythal** | நெய்தல் | Seaside - Love |
| **Paalai** | பாலை | Desert - Separation love |

---

## 4. Parsing Algorithm

### English vs Tamil Parsing

| Aspect | English | Tamil (Sangam) |
|--------|---------|----------------|
| Word order | SVO | SOV |
| Morphology | Inflection | Agglutinative |
| Compounds | Simple | Sandhi-based |
| Prosody | Stress-timed | Syllable-timed |
| Poetry | Rhyme | Initial-letter alliteration |

### Tamil Parser Modules

```python
# Proposed Parser Structure

class SangamParser:
    """Tamil-first parser for Sangam literature"""
    
    def __init__(self):
        self.tamil_char = TamilCharacterEngine()
        self.sandhi = SandhiSplitter()
        self.prosody = ProsodyAnalyzer()
        self.thinai = LandscapeClassifier()
    
    def parse_poem(self, raw_text):
        # 1. Clean and normalize Tamil
        normalized = self.tamil_char.normalize(raw_text)
        
        # 2. Split Sandhi (compound words)
        split_words = self.sandhi.split_all(normalized)
        
        # 3. Analyze prosody (venpa pattern)
        prosody = self.prosody.analyze(split_words)
        
        # 4. Classify landscape
        landscape = self.thinai.classify(prosody)
        
        # 5. Extract metadata
        metadata = self.extract_header(raw_text)
        
        return Poem(normalized, metadata, prosody, landscape)
```

### Sandhi Rules (Word Joining)

| Rule | Tamil | Example |
|------|-------|---------|
| **Iru** | இருப்பு | குரு + ஆல் → குருவாக் குருவாற் |
| **Meli** | மெலிப்பு | வில் + ஆக → விறாக |
| **Kutri** | குற்றி | பல + ஆக → பலாக |
| **Pugur** | புச்சு | மகள் + உம் → மகளும்ம |

### Prosody Detection (Venpa)

```
Venpa Pattern: 4 + 4 + 4 syllables (default)

Example: "குறிஞ்சித் திறம் காண்பவர்க்கு"
         ┌──┬──┬──┐ ┌──┬──┬──┐ ┌──┬──┬──┐
         │கு│ரி│ங்│ │தி│ரம்│ │காண்│ப│வ│
         └──┴──┴──┘ └──┴──┴──┘ └──┴──┴──┘
           1  2  3    4  5  6    7  8  9
```

---

## 5. Data Format

### Library Structure

```
library/sangam/
├── Ettuttokai/
│   ├── Kuruntokai/
│   │   ├── kuruntokai_001.json
│   │   ├── kuruntokai_002.json
│   │   └── ...
│   ├── Purananuru/
│   │   └── ...
│   └── ...
├── Pattuppaattu/
│   └── ...
├── Tolkappiyam/
│   ├── eluttu.json    (Letters)
│   ├── col.json       (Words)
│   └── porul.json     (Meaning)
└── translations/
    ├── en/
    │   └── ...
    └── ta_modern/
        └── ...
```

### JSON Schema

```json
{
  "id": "kuruntokai_001",
  "title": "நாட்டுப்புறத் தலைவி",
  "poet": "குமரகுருபரர்",
  "era": "சங்ககாலம்",
  "collection": "Kuruntokai",
  "theme": "akam",
  "landscape": "marutham",
  "lines": [
    {
      "number": 1,
      "tamil": "அக்கா உழவீழ்க்குமென்",
      "transliteration": "akkaa uzaveezhkkumen",
      "syllable_count": 7,
      "prose": "..."
    }
  ],
  "translation": {
    "en": "...",
    "ta_modern": "..."
  },
  "metadata": {
    "source": "Project Madurai",
    "url": "https://...",
    "parsed_date": "2026-02-24"
  }
}
```

---

## 6. Translation Pipeline

### Two-Layer Translation

1. **Modern Tamil (ta_modern)**
   - Replace archaic words with modern equivalents
   - Update grammar to contemporary usage
   - Preserve poetic rhythm where possible

2. **English (en)**
   - Literal meaning first
   - Add cultural context in footnotes
   - Preserve metaphor imagery

### Translation Example

| Archaic Tamil | Modern Tamil | English |
|---------------|--------------|---------|
| ஔவை | பெண் | Woman |
| பரி | குதிரை | Horse |
|நெடுங்கட்(b)ம் | நீண்ட கடல் | Vast ocean |

---

## 7. AI/ML Integration

### For Adhan (Tamil LLM)

```python
# Training data format for Adhan

# 1. Sentence pairs (translation)
{
    "source": "குறிஞ்சித் திறம் காண்பவர்க்கு",
    "target": "Those who understand the mountain region",
    "pair_type": "archaic_to_en"
}

# 2. Word-level alignment
{
    "word": "குறிஞ்சி",
    "modern": "மலை",
    "en": "mountain",
    "pos": "noun"
}

# 3. Prosody patterns
{
    "pattern": "4-4-4",
    "type": "venpa",
    "example": "அக்கா உழவீழ்க்குமென்"
}
```

### Model Fine-tuning

- **Base Model**: XLM-RoBERTa-base (124M params)
- **Fine-tune on**:
  1. Sangam poems (archaic Tamil)
  2. Modern Tamil corpus
  3. Translation pairs

---

## 8. Implementation Roadmap

### Phase 1: Data Collection (Week 1-2)
- [ ] Scrape Project Madurai
- [ ] Download Tamil Virtual Academy corpus
- [ ] Manual cleanup of 2,381 poems
- [ ] Validate against scholarly editions

### Phase 2: Parser Development (Week 3-4)
- [ ] Build Tamil character engine
- [ ] Implement Sandhi splitter
- [ ] Create prosody analyzer
- [ ] Landscape classifier

### Phase 3: Structured Data (Week 5-6)
- [ ] Parse all Ettuttokai
- [ ] Parse Tolkappiyam
- [ ] Generate JSON files

### Phase 4: Translation (Week 7-8)
- [ ] Create modern Tamil version
- [ ] Generate English translations
- [ ] Human review cycle

### Phase 5: Training Data (Week 9-10)
- [ ] Generate Adhan training pairs
- [ ] Test model on sample data
- [ ] Document findings

---

## 9. Tools & Tech Stack

| Component | Technology |
|-----------|------------|
| **Scraping** | Python + BeautifulSoup |
| **Parsing** | Rust (for speed) |
| **Database** | SQLite/JSON files |
| **API** | Rust/Actix |
| **Training** | Comet ML + Transformers |
| **Storage** | Git LFS |

---

## 10. Key Files to Parse

### URLs to Scrape

```
Project Madurai - Ettuttokai:
https://www.projectmadurai.org/pm/ettuttokai.html
https://www.projectmadurai.org/pm/kuruntokai.html
https://www.projectmadurai.org/pm/purananuru.html

Tolkappiyam:
https://www.projectmadurai.org/pm/tolkappiyam.html

Glossary:
https://www.projectmadurai.org/pm/dictionary.html
```

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Poems extracted | 2,500+ |
| Accuracy (parsing) | >95% |
| Translation coverage | 100% |
| Training samples | 50,000+ |
| Modern Tamil pairs | 20,000+ |

---

## 12. Next Steps

1. **Start scraping** - Get raw text from Project Madurai
2. **Build parser prototype** - Test on 10 poems first
3. **Create JSON schema** - Validate data structure
4. **Pilot translation** - Translate Kuruntokai first 50 poems

---

*Document Version: 1.0*
*Maintainers: Arivu (Data), Vajra (Architecture)*
