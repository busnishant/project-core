Rewrite data/logs.js completely.
Make the logging system clean, professional,
and industry standard. Like a real production app.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SPEC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format every log line exactly like this:

  2026-03-04 03:31:18  INFO   boot     Starting Aaradhya...
  2026-03-04 03:31:18  INFO   load     Commands loaded (4)
  2026-03-04 03:31:18  INFO   regs     /ask /mode /setup /wipe
  2026-03-04 03:31:19  INFO   evnt     Online — serving 1 guild
  2026-03-04 03:31:50  INFO   evnt     mention ← bus.nishant
  2026-03-04 03:31:51  INFO   tone     Prompt ready (11 layers · 11199 chars)
  2026-03-04 03:31:52  INFO   chat     Response sent (312ms)
  2026-03-04 03:31:52  INFO   chat     Tokens used: 847
  2026-03-04 03:32:10  WARN   chat     Slow response (2341ms)
  2026-03-04 03:32:50  ERROR  chat     OpenRouter 429 — retrying in 5s
  2026-03-04 03:33:00  ERROR  chat     OpenRouter 404 — model not found

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOG LEVELS — 4 only
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFO  → normal operations, green
WARN  → slow responses, retries, non-critical, yellow
ERROR → API failures, crashes, unhandled errors, red
DEBUG → verbose detail, only shown if DEBUG=true in .env

Use ANSI color codes:
INFO  → \x1b[32m  (green)
WARN  → \x1b[33m  (yellow)
ERROR → \x1b[31m  (red)
DEBUG → \x1b[36m  (cyan)
Reset → \x1b[0m

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATTING RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Timestamp: local time, not UTC, no T or Z
Format: YYYY-MM-DD HH:MM:SS
Use: new Date().toLocaleString('sv').replace('T',' ')

Level: always 5 chars wide, padded with spaces
INFO  → "INFO "
WARN  → "WARN "
ERROR → "ERROR"
DEBUG → "DEBUG"

Tag: always 6 chars wide, padded with spaces
boot  → "boot  "
load  → "load  "
regs  → "regs  "
evnt  → "evnt  "
tone  → "tone  "
chat  → "chat  "
cmd   → "cmd   "
data  → "data  "
err   → "err   "

Message: clean, short, no brackets around tag,
no JSON dumps in normal logs, no raw error objects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STARTUP BLOCK — show once on boot
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When bot starts print a clean header block:

  ──────────────────────────────────────
   Aaradhya  ·  Discord Bot  ·  v1.0.0
   Node 18+  ·  discord.js v14
  ──────────────────────────────────────

Then normal logs begin below it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIFIC LOG MESSAGES — update these
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

core/boot.js:
  INFO  boot    Starting Aaradhya...

disc/regs.js — one line per command loaded:
  INFO  regs    /ask registered
  INFO  regs    /mode registered
Then a summary line:
  INFO  regs    4 commands ready

disc/evnt.js — on ready:
  INFO  evnt    Online as Aaradhya♡ · 1 guild

disc/evnt.js — on mention/reply/DM:
  INFO  evnt    mention ← username
  INFO  evnt    reply   ← username
  INFO  evnt    dm      ← username

mind/tone.js — replace the verbose prompt preview:
  INFO  tone    Prompt ready (11 layers · 11199 chars)
No more showing the prompt content in logs.
That is the main cleanup needed.

mind/chat.js — on success:
  INFO  chat    Response sent (312ms)
  DEBUG chat    Tokens: prompt=450 completion=120 total=570

mind/chat.js — on slow response (>2000ms):
  WARN  chat    Slow response (2341ms)

mind/chat.js — on 429:
  ERROR chat    Rate limited — retry in 5s

mind/chat.js — on 404:
  ERROR chat    Model not found — check conf/aicf.json

mind/chat.js — on any other error:
  ERROR chat    API error [status] — [short message]

cmds/*.js — on slash command used:
  INFO  cmd     /ask ← username

data/save.js — on file write:
  DEBUG data    Saved msgs.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGGER API — export these functions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const log = {
  info:  (tag, msg) => print('INFO',  tag, msg),
  warn:  (tag, msg) => print('WARN',  tag, msg),
  error: (tag, msg) => print('ERROR', tag, msg),
  debug: (tag, msg) => print('DEBUG', tag, msg),
}

Every file in the project imports and uses
this logger — no raw console.log anywhere.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER REWRITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Go through every file in the project and:
- Replace all console.log() with log.info()
- Replace all console.error() with log.error()
- Replace all console.warn() with log.warn()
- Remove any raw JSON.stringify() from log calls
- Remove the verbose prompt preview from tone.js
  — just log layer count and char count

Update read/maps.md and read/done.md.
Then npm start — show me the clean output.