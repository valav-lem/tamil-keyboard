# Sangam Extractor (Tamil + Sister Languages)

## Scope
This document defines data coverage goals for `sangam_extractor` limited to:
- Tamil (`ta`)
- Malayalam (`ml`)
- Telugu (`te`)
- Kannada (`kn`)

No other languages are in scope for this extractor.

## Goal
Increase corpus diversity across **multiple historical and modern time frames** so models learn both classical and contemporary usage patterns.

## Time-Frame Coverage

| Bucket | Period | Target Share | Notes |
|---|---|---:|---|
| Classical | pre-600 CE | 15% | Sangam-era and early classical works |
| Medieval | 600-1600 CE | 20% | Bhakti/epic/commentary traditions |
| Early Modern | 1600-1900 CE | 20% | Print-era prose/poetry, reform texts |
| Modern | 1900-2000 CE | 25% | News, essays, novels, public writing |
| Contemporary | 2000-present | 20% | Web, public forums, modern spoken style |

> The percentages are per-language targets and can vary by ±5% based on source availability.

## Language-Specific Priorities

### Tamil (`ta`)
- Strong classical representation (Sangam, post-Sangam, Bhakti).
- Preserve diacritics and orthographic variants.
- Keep metadata fields: `era`, `century`, `script`, `source`.

### Malayalam (`ml`)
- Balance pre-modern literary forms with modern prose/news.
- Retain script-normalized and original forms when available.

### Telugu (`te`)
- Include court/poetic traditions and modern public-domain prose.
- Maintain genre tags (`poetry`, `commentary`, `prose`, `news`).

### Kannada (`kn`)
- Cover early literary canon through contemporary web text.
- Prioritize clean provenance metadata for period attribution.

## Required Metadata
Each extracted record should include:
- `text`
- `lang`
- `era_bucket` (`classical|medieval|early_modern|modern|contemporary`)
- `year_start` (nullable)
- `year_end` (nullable)
- `source_name`
- `license`
- `quality_score`

## Extraction Rules
- Prefer public-domain and clearly licensed sources.
- Keep original text; avoid aggressive normalization that erases historical variants.
- Reject records with unknown language or missing provenance.
- Deduplicate within each era bucket before global deduplication.

## Output Contract (JSONL)
```json
{
  "text": "...",
  "lang": "ta",
  "era_bucket": "classical",
  "year_start": -300,
  "year_end": 300,
  "source_name": "project_madurai",
  "license": "Public Domain",
  "quality_score": 0.93
}
```

## Acceptance Criteria
- All four languages present in output.
- Each language has non-zero data in at least 4 of 5 era buckets.
- Era bucket skew remains within target ±5% where feasible.
- 100% records include required metadata fields.

---

## Project Madurai Book Export (Tamil Focus)

Current implementation adds a dedicated scraper for Project Madurai and writes
human-readable files in book format under `data/sangam/`.

### Run Command

```bash
python -m src.cli --task sangam \
  --sangam-index-url https://www.projectmadurai.org/ \
  --sangam-max-pages 120 \
  --sangam-output-dir data/sangam
```

### Output Layout

```text
data/sangam/
  <author_slug>/
    BOOK.txt
    0001_<song-title>.txt
    0002_<song-title>.txt
    ...
```

### Ordering Rules

- Primary order: `author`
- Secondary order: `song_number`
- Tertiary order: `title`

### Sanitization Rules (Tamil)

- Keeps Tamil Unicode block (`U+0B80`-`U+0BFF`), Tamil digits, and basic punctuation.
- Removes non-Tamil noisy symbols and collapses repeated whitespace.
- Preserves line breaks for readability in `BOOK.txt` and per-song files.
