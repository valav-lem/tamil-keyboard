# Tasks - Yazhi Corpus Engine

## Completed

### 2026-02-22

- [x] Create yazhi-datasets repo structure
  - Created `yazhi_datasets/{ta,hi,te,ml,en}` directories
  
- [x] Add Hindi Wikipedia scraper
  - Created `src/scrapers/wikipedia.py`
  - Features:
    - Search Hindi Wikipedia articles
    - Get article content by title or pageid
    - Browse articles by category
    - Get random articles
    - Batch scraping
    - Export to JSONL format
  
- [x] Export Tamil corpus from Adhan
  - Copied Tamil dataset from `aadhan/data/final/tamil_texts/hf/` to `yazhi_datasets/ta/`
  - Files: `train.jsonl`, `test.jsonl`, `validation.jsonl`

- [x] Add `sangam_extractor` docs for Tamil + sister languages
  - Created `src/data/sangam_extractor.md`
  - Added era-bucket coverage plan (classical → contemporary)
  - Scoped languages: `ta`, `ml`, `te`, `kn`

## Pending

- [ ] Add scrapers for other languages (Telugu, Malayalam, English)
- [ ] Build data processing pipelines
- [ ] Add dataset validation scripts
- [ ] Create HuggingFace dataset configs
