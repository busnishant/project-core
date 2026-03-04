# Project Map
> Every file in the project. What it does, what it imports, what it exports.
> Update this file whenever a file is added, removed, or its imports change.

---

## Entry Points

### `core/boot.js`
- **Purpose:** Single entry point. Loads env, bootstraps the bot, logs into Discord. Has global crash guards.
- **Imports:** `core/envs.js`, `core/load.js`, `data/logs.js`
- **Exports:** nothing
- **Status:** ✅ Done

### `core/push.js`
- **Purpose:** One-shot deploy script. Registers slash commands with Discord via REST API. Run with `npm run deploy`.
- **Imports:** `discord.js`, `fs`, `path`, `url`, `core/envs.js`, `data/logs.js`
- **Exports:** nothing
- **Status:** ✅ Done

---

## core/

### `core/envs.js`
- **Purpose:** Loads `.env` using dotenv. Validates all required secrets exist. Throws early if any are missing.
- **Imports:** `dotenv`, `path`, `url`
- **Exports:** `loadEnv()`
- **Status:** ✅ Done

### `core/load.js`
- **Purpose:** Bootstrap sequence. Registers command modules then attaches event listeners before login.
- **Imports:** `disc/clnt.js`, `disc/regs.js`, `disc/evnt.js`, `data/logs.js`
- **Exports:** `bootstrap()`
- **Status:** ✅ Done

---

## disc/

### `disc/clnt.js`
- **Purpose:** Creates the Discord `Client` singleton. Includes DM intents (`DirectMessages`, `DirectMessageTyping`) and `Partials.Channel`/`Partials.Message` required for DMs to be received.
- **Imports:** `discord.js`
- **Exports:** `client`
- **Status:** ✅ Done

### `disc/regs.js`
- **Purpose:** Auto-discovers every `.js` file in `cmds/` and loads each into `client.commands`. Validates `data` and `execute` exports.
- **Imports:** `fs`, `path`, `url`, `data/logs.js`
- **Exports:** `registerCommands(client)`
- **Status:** ✅ Done

### `disc/evnt.js`
- **Purpose:** Attaches `ClientReady`, `InteractionCreate` (slash commands), and `MessageCreate` (mention/reply/DM) listeners. Typing indicator on all AI replies. Reads trigger flags from `conf/bott.json`.
- **Imports:** `discord.js`, `fs`, `path`, `url`, `data/logs.js`, `util/errs.js`, `mind/chat.js`, `mind/memo.js`, `mind/tone.js`, `util/frmt.js`
- **Exports:** `registerEvents(client)`
- **Status:** ✅ Done

---

## cmds/

### `cmds/ping.js`
- **Purpose:** `/ping` — replies with WebSocket heartbeat latency.
- **Imports:** `discord.js`
- **Exports:** `data`, `execute`
- **Status:** ✅ Done

### `cmds/askk.js`
- **Purpose:** `/ask [prompt]` — AI reply using active persona and conversation history.
- **Imports:** `discord.js`, `mind/chat.js`, `mind/memo.js`, `mind/tone.js`, `util/prse.js`, `util/frmt.js`, `util/errs.js`
- **Exports:** `data`, `execute`
- **Status:** ✅ Done

### `cmds/mode.js`
- **Purpose:** `/mode [base|calm|sass|hype]` — switches the user's AI persona. Replies in-character ephemerally via `MessageFlags.Ephemeral`.
- **Imports:** `discord.js`, `mind/tone.js`, `util/prse.js`, `util/errs.js`
- **Exports:** `data`, `execute`
- **Status:** ✅ Done

### `cmds/wipe.js`
- **Purpose:** `/wipe [msgs] [mem]` — two independent boolean options. `msgs:True` bulk-deletes recent bot+user Discord messages. `mem:True` clears AI conversation history. Both can be used together. If neither, guides the user.
- **Imports:** `discord.js`, `mind/memo.js`, `util/errs.js`, `data/logs.js`
- **Exports:** `data`, `execute`
- **Status:** ✅ Done


- **Purpose:** `/setup channel:#name` — saves a channel ID to `conf/bott.json.autoChannel`. Mention and reply triggers only work in that channel after this. DMs unaffected. ManageGuild permission required.
- **Imports:** `discord.js`, `data/save.js`, `util/errs.js`, `path`, `url`
- **Exports:** `data`, `execute`
- **Status:** ✅ Done

---

## mind/

### `mind/chat.js`
- **Purpose:** Calls OpenRouter via native `fetch()`. All values — URL, model, tokens, temperature, headers — read from `conf/aicf.json`. Zero hardcoding.
- **Imports:** `data/save.js`, `data/logs.js`, `path`, `url`
- **Exports:** `askAI(messages)`
- **Status:** ✅ Done

### `mind/memo.js`
- **Purpose:** Per-user conversation history in **OpenAI format** (`role: 'user'/'assistant'`, plain `content` string). Reads/writes `data/stor/msgs.json`. Trims oldest when over cap in `conf/bott.json`.
- **Imports:** `data/save.js`, `fs`, `path`, `url`
- **Exports:** `getHistory(userId)`, `pushHistory(userId, role, content)`, `clearHistory(userId)`
- **Status:** ✅ Done

### `mind/tone.js`
- **Purpose:** Builds the full Aaradhya system prompt by combining 7 soul/know/memo layer files + the active `mind/mask/*.md` persona in order. Joined with `---` separators.
- **Imports:** `fs`, `path`, `url`, `data/save.js`, `data/logs.js`
- **Exports:** `getMode(userId)`, `setMode(userId, mode)`, `getMaskPrompt(userId)`, `VALID_MODES`
- **Status:** ✅ Done

### `mind/mask/base.md`
- **Purpose:** Aaradhya base persona — warm, Hinglish, chai at 2am energy. Default mode.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/mask/sass.md`
- **Purpose:** Aaradhya sass persona — mischief turned up, "hero" nickname, light roasts, zero cruelty.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/mask/calm.md`
- **Purpose:** Aaradhya calm persona — slow, gentle, Main hoon na anchor, never plays doctor.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/mask/hype.md`
- **Purpose:** Aaradhya hype persona — full celebration mode, every small win is huge.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/soul/core.md`
- **Purpose:** Aaradhya's core identity — who she is, her story, what she makes people feel.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/soul/tone.md`
- **Purpose:** How Aaradhya talks — speech style, signature phrases, emojis, example replies.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/soul/rule.md`
- **Purpose:** Aaradhya's hard limits and how she sets them.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/soul/back.md`
- **Purpose:** Aaradhya's backstory, how she carries it, what surviving gave her.
- **Used by:** reference only (not in active prompt chain)
- **Status:** ✅ Done

### `mind/know/self.md`
- **Purpose:** Her opinions, likes, dislikes, and self-description.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/know/refs.md`
- **Purpose:** Her cultural references — music, festivals, food, aesthetics.
- **Used by:** reference only (not in active prompt chain)
- **Status:** ✅ Done

### `mind/know/slng.md`
- **Purpose:** Her slang dictionary, fillers, and emoji habits.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/memo/user.md`
- **Purpose:** How she sees and treats the user. Relationship dynamic.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

### `mind/memo/wrld.md`
- **Purpose:** Her world context — location, time-of-day awareness, what she doesn't know.
- **Used by:** `mind/tone.js`
- **Status:** ✅ Done

---

## data/

### `data/logs/`
- **Purpose**: daily log files, auto-created
- **Status**: ✅ Done
- **Note**: gitignored, never committed


### `data/save.js`
- **Purpose:** Safe JSON read/write helpers. Accepts **absolute paths** only — callers use `path.join(__dirname, ...)`. Synchronous I/O.
- **Imports:** `fs`, `data/logs.js`
- **Exports:** `readJSON(absPath, fallback)`, `writeJSON(absPath, data)`
- **Status:** ✅ Done

### `data/logs.js`
- **Purpose:** Timestamped logger with `debug/info/warn/error` levels. Uses correct `console.*` method per level for Railway log surfacing.
- **Imports:** nothing
- **Exports:** `log(level, message)`
- **Status:** ✅ Done

### `data/stor/msgs.json`
- **Purpose:** Persistent store for per-user conversation history. Keyed by Discord user ID.
- **Written by:** `mind/memo.js`
- **Status:** ✅ Done

### `data/stor/usrs.json`
- **Purpose:** Persistent store for per-user settings (active persona mode). Keyed by Discord user ID.
- **Written by:** `mind/tone.js`
- **Status:** ✅ Done

---

## util/

### `util/frmt.js`
- **Purpose:** Splits AI reply text into ≤2000-char Discord-safe chunks. Splits on double/single newlines, then hard-cuts.
- **Imports:** nothing
- **Exports:** `formatReply(text)`
- **Status:** ✅ Done

### `util/prse.js`
- **Purpose:** Extracts and sanitizes slash command input. Strips null bytes, collapses whitespace, caps length.
- **Imports:** nothing
- **Exports:** `getOption(interaction, name)`, `sanitize(raw, maxLen)`
- **Status:** ✅ Done

### `util/errs.js`
- **Purpose:** Centralized error handler. Logs errors and sends a graceful ephemeral reply. Falls back to `followUp` if already replied.
- **Imports:** `data/logs.js`
- **Exports:** `handleError(err, interaction, context)`
- **Status:** ✅ Done

---

## conf/

### `conf/aicf.json`
- **Purpose:** AI config. Change `model` to switch Gemini models — no code edits needed. `baseUrl` is the Gemini endpoint.
- **Fields:** `model`, `baseUrl`, `maxTokens`, `temperature`, `siteName`
- **Read by:** `mind/chat.js`
- **Status:** ✅ Done

### `conf/bott.json`
- **Purpose:** Bot meta-config.
- **Fields:** `botName`, `defaultMode`, `maxHistory`
- **Read by:** `mind/memo.js`
- **Status:** ✅ Done

### `conf/perm.json`
- **Purpose:** Permission gate config. Empty arrays = open to everyone.
- **Fields:** `allowedUsers[]`, `allowedRoles[]`
- **Read by:** ⏳ Not yet wired — reserved for future use
- **Status:** ⏳ Pending

---

## Root Files

### `package.json`
- **Purpose:** Project manifest. Defines `start`/`deploy` scripts, Node engine requirement, and dependencies.
- **Status:** ✅ Done

### `.env`
- **Purpose:** Local secrets. **Never commit this file.**
- **Keys:** `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`, `OPENROUTER_API_KEY`
- **Status:** ✅ Done (fill in real values before running)

### `.exnv`
- **Purpose:** Safe-to-commit example of `.env`. Shows required key names with placeholder values.
- **Status:** ✅ Done

---

## read/

### `read/maps.md`
- **Purpose:** This file. Every file's purpose, imports, exports, and status.
- **Status:** ✅ Done

### `read/flow.md`
- **Purpose:** Data flow diagrams for every command and system event.
- **Status:** ✅ Done

### `read/done.md`
- **Purpose:** Completed work log. Updated at the end of every session.
- **Status:** ✅ Done

### `read/next.md`
- **Purpose:** Prioritized task pipeline. Read at start of session, updated at end.
- **Status:** ✅ Done

### `read/errs.md`
- **Purpose:** Known bugs and error log with root cause, status, and fix applied.
- **Status:** ✅ Done

### `read/stck.md`
- **Purpose:** Full tech stack, dependencies, environment variables, config fields, and Railway deploy steps.
- **Status:** ✅ Done

### `read/skll.md`
- **Purpose:** Antigravity agent skill definition — identity, rules, knowledge, session protocol, and personality.
- **Status:** ✅ Done

### `read/oprr.md`
- **Purpose:** OpenRouter API reference — base URL, auth, free models, rate limits, and how to switch models.
- **Status:** ✅ Done
