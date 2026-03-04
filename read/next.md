# Next Steps Pipeline
> What needs to be built or fixed next, ordered by priority.
> Update this at the start and end of every session.

---

## 🧠 Knowledge Base Pipeline — Fill In Order

> Fill one file at a time. After filling any file — test with `/ask` immediately.
> Fill one file at a time. After filling any file — test with `/ask` immediately.
> Aaradhya uses it automatically. No code changes ever needed.
> *Note from Audit: Most of these files exist but are empty placeholders right now. `fear`, `chng`, `tech`, `news`, `lang` are not even wired yet into `tone.js`.*

### Phase 1 — NIOS Core (Priority 1)
- [ ] `mind/nios/info.md` → what NIOS is, how it works
- [ ] `mind/nios/subj.md` → her subjects list
- [ ] `mind/nios/exam.md` → exam dates and schedule
- [ ] `mind/nios/tma.md` → TMA details and submission
- [ ] `mind/nios/tips.md` → how she studies
- [ ] `mind/nios/faqs.md` → common questions answered

### Phase 2 — Life & Routine (Priority 2)
- [ ] `mind/life/rout.md` → her daily routine
- [ ] `mind/life/hlth.md` → healing and health tips
- [ ] `mind/life/food.md` → chai, sattu, food she knows
- [ ] `mind/life/fest.md` → Chhath, festivals, culture

### Phase 3 — Growth Log (Priority 3)
- [ ] `mind/grow/jour.md` → add journal entries over time
- [ ] `mind/grow/wins.md` → log her milestones
- [ ] `mind/grow/fear.md` → fears she is working through
- [ ] `mind/grow/chng.md` → how she evolves

### Phase 4 — World Knowledge (Priority 4)
- [ ] `mind/wrld/tech.md` → tech she is discovering
- [ ] `mind/wrld/lang.md` → languages she knows
- [ ] `mind/wrld/news.md` → how she processes world events

---



- **What needs to happen:**
  - Read `allowedUsers` and `allowedRoles` from `conf/perm.json` in a new utility function (e.g. `util/prms.js`)
  - Call it at the top of every `execute()` in `cmds/*.js`
  - If the user fails the check, reply with an ephemeral "not allowed" message and return early
- **Files affected:** `util/prms.js` (new), `cmds/askk.js`, `cmds/mode.js`, `cmds/wipe.js`, `cmds/ping.js`
- **Why:** `conf/perm.json` exists but is not yet wired up. The bot currently allows anyone to use any command.

---

## Priority 2 — Add `/help` and `/vibe` commands

- **What needs to happen:**
  - Create `cmds/help.js` to list all commands, descriptions, and active persona. No AI call needed.
  - Create `cmds/vibe.js` to show the current personality mode for the user.
- **Files affected:** `cmds/help.js` (new), `cmds/vibe.js` (new)
- **Why:** Documented in master guide but missing from codebase. New users can't discover features easily.

---

## Priority 3 — Protect `data/stor/` files with write-locking

- **What needs to happen:**
  - Wrap `writeJSON()` in a simple async queue so concurrent writes to the same file don't clobber each other
  - This matters if the bot ever serves multiple users simultaneously
- **Files affected:** `data/save.js`
- **Why:** Current sync writes are safe for single-user bots but could corrupt JSON under concurrent load.

---

## Priority 4 — Add a `/status` command (admin only)

- **What needs to happen:**
  - Create `cmds/stat.js` with a `/status` slash command
  - Show: uptime, current model from `aicf.json`, number of users with saved history, gateway latency
  - Restrict to `allowedUsers` from `perm.json`
- **Files affected:** `cmds/stat.js` (new), `conf/perm.json`
- **Why:** Useful for bot owner to inspect health without checking Railway logs.

---

## Priority 5 — Push to GitHub and deploy to Railway

- **What needs to happen:**
  1. `git init` + `git add .` + initial commit
  2. Push to a new GitHub repo
  3. Connect repo to Railway — New Project → Deploy from GitHub
  4. Add `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `OPENROUTER_API_KEY` in Railway dashboard → Variables
  5. Run `npm run deploy` once to register slash commands
  6. Verify bot comes online in Railway logs
- **Files affected:** none (deploy only)
- **Why:** The bot is functionally complete and ready for live deployment.

---

## Priority 6 — Moderation Commands

- **What needs to happen:**
  - Create `cmds/clen.js` → `/clean [number]` — deletes X messages from the current channel
  - Create `cmds/bann.js` → `/ban @user [reason]` — bans a user, logs reason
  - Create `cmds/kick.js` → `/kick @user [reason]` — kicks a user, logs reason
  - Create `cmds/tout.js` → `/timeout @user [minutes]` — temporarily mutes a user
  - Create `cmds/slow.js` → `/slowmode [seconds]` — sets channel slowmode
  - Create `cmds/lock.js` → `/lock` — locks the current channel (no one can send messages)
  - Create `cmds/unlk.js` → `/unlock` — unlocks the channel
  - Add auto-delete behavior to bot replies — purge bot messages after X seconds (configurable in `conf/bott.json`)
- **Files affected:** `cmds/clen.js`, `cmds/bann.js`, `cmds/kick.js`, `cmds/tout.js`, `cmds/slow.js`, `cmds/lock.js`, `cmds/unlk.js` (all new) · `conf/bott.json` (add `autoDeleteSeconds` field)
- **Why:** Turns the bot into a full-featured personal server tool, not just an AI chatbot.
- **Note:** All mod commands require `MANAGE_MESSAGES`, `BAN_MEMBERS`, `KICK_MEMBERS`, or `MODERATE_MEMBERS` Discord permissions. The bot's role in the server must have these enabled.

