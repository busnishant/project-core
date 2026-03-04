# Tech Stack & Environment Reference

---

## Runtime

| Item | Version | Purpose |
|---|---|---|
| Node.js | `>=18.0.0` | Runtime. Required for native `fetch()` and full ES module support. |
| npm | bundled with Node | Package manager and script runner. |

---

## Dependencies

### `discord.js` — `^14.14.1`
- **What it does:** Official Discord API library. Handles the WebSocket connection, Gateway events, REST API calls, and slash command builders.
- **Used in:** `disc/clnt.js`, `disc/evnt.js`, `disc/regs.js`, `core/push.js`, `cmds/ping.js`, `cmds/askk.js`, `cmds/mode.js`, `cmds/wipe.js`

### `dotenv` — `^16.4.5`
- **What it does:** Reads a `.env` file and injects key/value pairs into `process.env` at startup.
- **Used in:** `core/envs.js`

> **No dev dependencies.** No TypeScript, no bundler, no transpiler. Pure JavaScript.

---

## Environment Variables

All secrets live in `.env` at the project root.
Copy `.exnv` → `.env` and fill in real values. **Never commit `.env`.**

| Variable | What it is | Where it is used |
|---|---|---|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal → Your App → Bot → Reset Token | `core/boot.js` (login) · `core/push.js` (REST auth) |
| `DISCORD_CLIENT_ID` | OAuth2 Application ID — not the bot user ID | `core/push.js` → `Routes.applicationCommands(id)` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `mind/chat.js` → `Authorization: Bearer` header |

**Where to get them:**
- `DISCORD_TOKEN` + `DISCORD_CLIENT_ID` → [discord.com/developers](https://discord.com/developers/applications) → Your Application
- `OPENROUTER_API_KEY` → [openrouter.ai/keys](https://openrouter.ai/keys) (free, no card needed)

---

## Configuration Files (safe to commit, not secrets)

### `conf/aicf.json`
| Field | Type | Default | What it controls |
|---|---|---|---|
| `model` | string | `mistralai/mistral-7b-instruct:free` | OpenRouter model. Browse free models at [openrouter.ai/models](https://openrouter.ai/models). Change here — no code edit needed. |
| `maxTokens` | number | `512` | Max tokens in the AI reply. |
| `temperature` | number | `0.85` | Creativity. `0` = deterministic, `1` = very varied. |
| `siteUrl` | string | your repo URL | Sent as `HTTP-Referer` header to OpenRouter. |
| `siteName` | string | `CoreBot` | Sent as `X-Title` header to OpenRouter. |

### `conf/bott.json`
| Field | Type | Default | What it controls |
|---|---|---|---|
| `botName` | string | `CoreBot` | Display name used in logs. |
| `defaultMode` | string | `base` | Persona used when a user has no saved preference. |
| `maxHistory` | number | `20` | Max messages kept per user in `msgs.json`. Oldest trimmed first. |

### `conf/perm.json`
| Field | Type | Default | What it controls |
|---|---|---|---|
| `allowedUsers` | string[] | `[]` | Discord user IDs allowed to use the bot. Empty = everyone. |
| `allowedRoles` | string[] | `[]` | Discord role IDs allowed. Empty = everyone. |

> ⏳ Permission checking is not yet implemented. See `next.md` Priority 1.

---

## Deployment

| Platform | Plan | URL |
|---|---|---|
| Railway | Free (Hobby) | [railway.app](https://railway.app) |

### How Railway runs the bot
Railway reads `package.json` → `scripts.start` → runs `node core/boot.js`.
No Procfile. No build step. No config files needed on the platform.

### Deploy steps
1. `git init && git add . && git commit -m "init"`
2. Push to GitHub
3. Railway → **New Project** → **Deploy from GitHub repo** → pick your repo
4. Railway dashboard → your service → **Variables** → add:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
  - `OPENROUTER_API_KEY`
5. Railway auto-deploys. Watch logs for `Logged in as <BotTag>`.
6. Run `npm run deploy` once locally (or in Railway shell) to register slash commands.

---

## AI Provider

| Item | Value |
|---|---|
| Provider | [OpenRouter](https://openrouter.ai) |
| Base URL | `https://openrouter.ai/api/v1/chat/completions` |
| Auth | `Authorization: Bearer <OPENROUTER_API_KEY>` |
| Required extra headers | `HTTP-Referer` (your site URL), `X-Title` (your app name) |
| Default model | `mistralai/mistral-7b-instruct:free` |
| HTTP client | Native `fetch()` — no SDK, no axios |
