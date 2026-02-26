# Sources of Truth - Training Data

## Authoritative Sources by Category

### 1. Tamil - Classical (Primary Source)

| Source | Type | URL | License | Status |
|--------|------|-----|---------|--------|
| Project Madurai | Tamil literature | projectmadurai.org | CC-BY-SA | ✅ Active |
| Tamil Virtual Academy | Dictionary/Texts | tamilvu.org | Government | ✅ |
| University of Chicago | Tamil texts | dspace.uchicago.edu | Varies | ✅ |
| Internet Archive | Ancient texts | archive.org | Public Domain | ✅ |

### 2. Religious Texts - Multi-Language

| Text | Languages | Source | License |
|------|-----------|--------|---------|
| Thirukkural | Tamil | projectmadurai.org | Public Domain |
| Ramayana | Tamil, Hindi | valmikiramayan.net | Public Domain |
| Mahabharata | Tamil, Hindi | vedepo.org | Public Domain |
| Bible | Tamil, English | biblegateway.com | KJV Public Domain |
| Quran | Tamil, Arabic | quran.com | Public Domain |

### 3. Government & Legal

| Source | Type | URL |
|--------|------|-----|
| India Code | Laws | indiacode.nic.in |
| Tamil Nadu Gov | Orders | tn.gov.in |
| Press Information Bureau | News | pib.gov.in |
| NITI Aayog | Reports | niti.gov.in |

### 4. Modern Corpora

| Source | Type | Languages |
|--------|------|-----------|
| Wikipedia | Articles | All 22 |
| CommonCrawl | Web | en, hi, ta |
| News APIs | Articles | All |

---

## Extraction Pipeline

```
Sources → Scraper → Cleaner → Validator → Sanitizer → JSONL
```

### Step 1: Identify Sources
- Categorize by type (classical, religious, gov, web)
- Note license and accessibility

### Step 2: Scrape
- Use appropriate extractor per source
- Preserve metadata (era, source, license)

### Step 3: Clean
- Remove HTML, ads, noise
- Normalize Unicode
- Fix encoding issues

### Step 4: Validate
- Language detection
- Quality scoring
- Remove duplicates

### Step 5: Sanitize
- Strip PII
- Remove harmful content
- Final quality check

### Step 6: Export
- JSONL format
- Train/val/test splits
- Push to yazhi-datasets

---

## Sangam Extractor - Improved

### Current Status
- Project Madurai scraper exists
- Sangam era coverage: 15% target
- Output: JSONL with metadata

### Improvements Needed
1. Add more classical sources (external links)
2. Multi-threaded scraping
3. Better error handling
4. Progress tracking

### Run
```bash
cd yazhi-corpus-engine
python -m src.cli --task sangam --max-records 10000
```

---

*Arivu - Data Pipeline*
*Updated: 2026-02-22*
