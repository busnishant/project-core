You are a senior Node.js developer and knowledge 
architect. Create the future knowledge base folder 
structure for Aaradhya. Create all folders and files 
now but leave content as clearly marked placeholder 
sections only — no fake data.

CREATE THIS EXACT STRUCTURE:

mind/
├── soul/          ← already exists, skip
├── mask/          ← already exists, skip
├── memo/          ← already exists, skip
├── know/          ← already exists, skip
│
├── grow/          ← her personal growth over time
│   ├── jour.md    ← journal entries, life moments
│   ├── wins.md    ← milestones she has crossed
│   ├── fear.md    ← fears she is working through
│   └── chng.md    ← how she has changed, growth log
│
├── nios/          ← NIOS academic knowledge base
│   ├── info.md    ← what NIOS is, how it works
│   ├── subj.md    ← all subjects she is studying
│   ├── exam.md    ← exam dates, schedule, patterns
│   ├── tma.md     ← TMA details, submission info
│   ├── tips.md    ← study tips, how she studies
│   └── faqs.md    ← common NIOS questions answered
│
├── life/          ← general life knowledge she has
│   ├── hlth.md    ← health, breathing, healing tips
│   ├── rout.md    ← her daily routine and habits
│   ├── food.md    ← food she knows, recipes, chai
│   └── fest.md    ← festivals, traditions, culture
│
└── wrld/          ← world knowledge she is learning
    ├── tech.md    ← basic tech she is discovering
    ├── news.md    ← how she processes world events
    └── lang.md    ← languages she knows and learns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOR EACH FILE write only this template — 
no real content, just structure:

# [File Title]
## Status: ⏳ Pending — to be filled

## [Section 1 name]
<!-- add content here -->

## [Section 2 name]  
<!-- add content here -->

## Notes
<!-- any extra context here -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THEN update mind/tone.js:

Add a new function called loadKnowledge() that:
- Reads all files from mind/nios/ folder
- Reads all files from mind/life/ folder
- Reads mind/grow/jour.md and mind/grow/wins.md
- Combines them into a knowledge block
- Appends this block to the system prompt 
  AFTER the soul files but BEFORE the active mask
- If a file is empty or has only placeholder 
  content — skip it silently, do not inject it

This means as you fill files over time — 
Aaradhya automatically gets smarter with 
zero code changes needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE read/next.md with this pipeline:

## Knowledge Base Pipeline — Fill In Order

### Phase 1 — NIOS Core (Priority 1)
- mind/nios/info.md → what NIOS is
- mind/nios/subj.md → her subjects list
- mind/nios/exam.md → exam dates and schedule
- mind/nios/tma.md → TMA details
- mind/nios/tips.md → how she studies
- mind/nios/faqs.md → common questions

### Phase 2 — Life & Routine (Priority 2)  
- mind/life/rout.md → her daily routine
- mind/life/hlth.md → healing and health
- mind/life/food.md → chai, sattu, food
- mind/life/fest.md → Chhath, festivals

### Phase 3 — Growth Log (Priority 3)
- mind/grow/jour.md → add entries over time
- mind/grow/wins.md → log her milestones
- mind/grow/fear.md → fears she works through
- mind/grow/chng.md → how she evolves

### Phase 4 — World Knowledge (Priority 4)
- mind/wrld/tech.md → tech she is learning
- mind/wrld/lang.md → languages
- mind/wrld/news.md → world awareness

### Rule
Fill one file at a time.
After filling any file — test with /ask immediately.
Aaradhya will use that knowledge automatically.
No code changes ever needed to add new knowledge.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATE read/maps.md:

Add every new file with status ⏳ Pending.
Update mind/tone.js entry to reflect 
loadKnowledge() function added.

UPDATE read/done.md:
Log knowledge base structure created today.