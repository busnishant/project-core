# project-core

A personal Discord bot. Talks like a real person. Built for fun.

---

## what it does

- Responds when mentioned, replied to, or DM'd
- Adapts personality based on context
- Remembers your conversation history
- Helps with NIOS studies and heavy topics if asked

---

## stack

- [Discord.js v14](https://discord.js.org)
- [OpenRouter API](https://openrouter.ai) — free AI models
- Node.js 18+
- JSON file persistence — no database
- Railway for hosting

---

## setup

### 1. clone and install

```bash
git clone https://github.com/busnishant/project-core.git
cd project-core
npm install
```

### 2. create your `.env` file

Copy `.exnv` and rename it to `.env`, then fill in your values:

```env
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
OPENROUTER_API_KEY=
```

| variable | where to get it |
|---|---|
| `DISCORD_TOKEN` | [discord.com/developers](https://discord.com/developers/applications) → your app → Bot → Reset Token |
| `DISCORD_CLIENT_ID` | same page → General Information → Application ID |
| `DISCORD_GUILD_ID` | right-click your server in Discord → Copy Server ID |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) — free, no card needed |

### 3. invite the bot to your server

Go to your app on the Discord developer portal.

OAuth2 → URL Generator → check these:

```
scopes:       bot, applications.commands
permissions:  Administrator
```

Using **Administrator** is simpler than picking individual permissions.
Copy the generated URL → open in browser → select your server → Authorize.

### 4. register slash commands

```bash
npm run deploy
```

Run this once. Only needed again if you add or change commands.

### 5. start

```bash
npm start
```

---

## commands

| command | what it does |
|---|---|
| `/ask` | talk to the bot |
| `/mode` | switch personality — base, calm, sass, hype |
| `/wipe` | delete messages or clear memory |
| `/setup` | set which channel the bot lives in |
| `/vibe` | check current personality mode |
| `/help` | list all commands |

---

## switching the AI model

Open `conf/aicf.json` and change the `model` field.
No code changes needed — just edit and restart.

```json
{
  "model": "nousresearch/hermes-2-pro-llama-3-8b"
}
```

Free models that work well: [openrouter.ai/models](https://openrouter.ai/models?q=free)

---

## deploy to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repo
4. Add your environment variables in the Railway dashboard
5. Done — auto-deploys on every push

---

## personality

The bot's personality lives in `mind/` as plain markdown files.
Edit any file there to change how it talks, what it knows, or how it responds.
No code changes needed — just edit and restart.

```
mind/soul/    identity and rules
mind/mask/    mood modes
mind/nios/    study knowledge
mind/life/    general knowledge
```

---

*built by [projectcore](https://github.com/busnishant)*
