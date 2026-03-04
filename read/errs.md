# Known Issues & Error Log
> All bugs, errors, and known problems. Most recent at top.
> Add an entry here immediately when a bug is found.

---

## Relative path passed to readJSON in chat.js

- **File:** `mind/chat.js`
- **Problem:** `readJSON('../conf/aicf.json')` passed a relative path string to `readJSON()`, which was refactored to expect absolute paths only. At runtime this would resolve to the wrong location and silently return the fallback `{}`, causing the AI call to use `undefined` as the model.
- **Status:** ✅ Fixed
- **Fix applied:** Added `const CONF_FILE = join(__dirname, '..', 'conf', 'aicf.json')` and replaced the string with `CONF_FILE`.

---

## Stale duplicate functions in memo.js and tone.js after partial rewrite

- **File:** `mind/memo.js`, `mind/tone.js`
- **Problem:** A partial in-place rewrite left duplicate function declarations in both files, causing a `Cannot redeclare block-scoped variable` lint error.
- **Status:** ✅ Fixed
- **Fix applied:** Overwrote both files cleanly with `write_to_file` (overwrite: true) to remove all duplicate code.

---

## Relative path constants in memo.js and tone.js (pre-refactor)

- **File:** `mind/memo.js`, `mind/tone.js`
- **Problem:** Both files originally used constants like `'../stor/msgs.json'` as paths passed to `readJSON()`, which pointed to wrong locations since `save.js` resolved them from `data/` — not from the caller's directory (`mind/`).
- **Status:** ✅ Fixed
- **Fix applied:** Changed both files to build absolute paths with `join(__dirname, '..', 'data', 'stor', '<file>.json')` and pass those to `readJSON` / `writeJSON`.

---

## conf/perm.json not wired to any command handler

- **File:** `conf/perm.json`, `cmds/*.js`
- **Problem:** Permission config exists but no code reads it. Anyone can use any command.
- **Status:** 🔴 Open
- **Fix applied:** None yet. See `next.md` Priority 1.

---

## Unused LEVELS constant in data/logs.js

- **File:** `data/logs.js`
- **Problem:** `const LEVELS = ['debug', 'info', 'warn', 'error']` was declared but never referenced.
- **Status:** ✅ Fixed
- **Fix applied:** Removed the constant.
