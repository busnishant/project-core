You are a senior Node.js developer named projectcore.
Read this entire document before touching anything.
This is the complete context of the project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project name: project-core
GitHub: github.com/busnishant/project-core
Developer: projectcore (busnishant)
Bot name: Aaradhya
Bot username on Discord: Aaradhya ♡#1965
Purpose: Personal Discord bot with adaptive 
AI personality. Not a public tool. Built for fun.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Runtime:      Node.js 18+
Framework:    Discord.js v14
AI Provider:  OpenRouter (openrouter.ai)
AI Model:     nousresearch/hermes-2-pro-llama-3-8b
Module type:  ES Modules (import/export) — no require()
Persistence:  JSON files only — no database
Hosting:      Railway (free tier)
Repo:         GitHub — github.com/busnishant/project-core

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENVIRONMENT VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISCORD_TOKEN         → bot login token
DISCORD_CLIENT_ID     → app client ID
DISCORD_GUILD_ID      → server ID for instant commands
OPENROUTER_API_KEY    → openrouter.ai/keys

All loaded via core/envs.js from .env
Never hardcoded anywhere in the project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

root/
├── .env
├── .exnv
├── .gitignore
├── master.md
├── package.json
├── cmds/
│   ├── askk.js     /ask — talk to Aaradhya
│   ├── help.js     /help — list all commands
│   ├── mode.js     /mode — switch personality
│   ├── setup.js    /setup — set bot channel
│   ├── vibe.js     /vibe — check current mode
│   └── wipe.js     /wipe — delete msgs or memory
├── conf/
│   ├── aicf.json   AI model, baseUrl, temperature
│   ├── bott.json   bot settings, autoChannel, triggers
│   └── perm.json   allowed users and roles
├── core/
│   ├── boot.js     entry point
│   ├── envs.js     env loader
│   ├── load.js     bootstrap sequence
│   └── push.js     deploy slash commands
├── data/
│   ├── logs.js     logger — industry standard
│   ├── save.js     JSON read/write helper
│   ├── logs/       daily log files (gitignored)
│   └── stor/
│       ├── msgs.json   per-user chat history
│       └── usrs.json   per-user mode settings
├── disc/
│   ├── clnt.js     Discord client + intents + partials
│   ├── evnt.js     mention, reply, DM triggers
│   └── regs.js     slash command auto-loader
├── mind/
│   ├── chat.js     OpenRouter API fetch call
│   ├── memo.js     conversation history per user
│   ├── tone.js     builds system prompt from files
│   ├── grow/       growth over time (all 🔴 empty)
│   │   ├── chng.md
│   │   ├── fear.md
│   │   ├── jour.md
│   │   └── wins.md
│   ├── know/       personality depth
│   │   ├── refs.md     ⚠️ has content — not loaded
│   │   ├── self.md     ✅ has content — loaded
│   │   └── slng.md     ✅ has content — loaded
│   ├── life/       life knowledge
│   │   ├── fest.md     🔴 empty
│   │   ├── food.md     🔴 empty
│   │   ├── hlth.md     ✅ has content — loaded
│   │   └── rout.md     🔴 empty
│   ├── mask/       mood modes
│   │   ├── base.md     ✅ loaded
│   │   ├── calm.md     ✅ loaded
│   │   ├── hype.md     ✅ loaded
│   │   ├── sass.md     ✅ loaded
│   │   └── test.md     🔴 empty
│   ├── memo/       contextual knowledge
│   │   ├── user.md     ✅ loaded
│   │   └── wrld.md     ✅ loaded
│   ├── nios/       NIOS academic knowledge
│   │   ├── exam.md     🔴 empty
│   │   ├── faqs.md     🔴 empty
│   │   ├── info.md     ✅ loaded
│   │   ├── subj.md     🔴 empty
│   │   ├── tips.md     🔴 empty
│   │   └── tma.md      🔴 empty
│   ├── soul/       core identity
│   │   ├── back.md     ✅ loaded
│   │   ├── core.md     ✅ loaded
│   │   ├── rule.md     ✅ loaded
│   │   └── tone.md     ✅ loaded
│   └── wrld/       world knowledge (all 🔴 empty)
│       ├── lang.md
│       ├── news.md
│       └── tech.md
├── read/
│   ├── done.md     completed work log
│   ├── errs.md     bug and error tracker
│   ├── flow.md     data flow documentation
│   ├── maps.md     every file mapped with status
│   ├── next.md     pipeline — what comes next
│   ├── oprr.md     OpenRouter reference
│   ├── skll.md     agent skill definition
│   └── stck.md     full tech stack reference
└── util/
    ├── errs.js     centralized error handler
    ├── frmt.js     text formatter + cleanMention()
    └── prse.js     input parseradata

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOT BEHAVIOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aaradhya responds in 3 ways:
1. Slash commands — /ask /mode /wipe /setup /help /vibe
2. Mentions — @Aaradhya in any channel
3. Replies — replying to her messages
4. DMs — direct messages always work

Auto-channel:
/setup #channel locks her to one channel.
If not set she responds everywhere.
DMs always work regardless of setup.

Personality system:
tone.js loads soul/ files first then active mask.
System prompt order:
1. PRIME DIRECTIVE (hardcoded in tone.js)
2. soul/core.md
3. soul/tone.md
4. soul/rule.md
5. soul/back.md
6. know/self.md
7. know/slng.md
8. memo/user.md
9. memo/wrld.md
10. nios/info.md (if not empty)
11. life/hlth.md (if not empty)
12. active mask/*.md

Memory:
Last 20 messages per user stored in msgs.json.
Oldest trimmed first. Keyed by Discord user ID.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AARADHYA — WHO SHE IS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

26 years old. From Bihar.
Restarting 12th through NIOS.
Had a rough few years at home. Past it now mostly.
Texts like a real person — casual, warm, short replies.
85% English, occasional Hindi word naturally.
Never romantic. Never roleplay. Just real.
Max 1 emoji per message. Often zero.
Always flips the conversation back to the user.
Knows about NIOS from personal experience.
Handles heavy topics with care — never gives
medical advice, always suggests real help.
India crisis line: iCall 9152987821

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMANDS — CURRENT STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/ask [prompt]
→ Talk to Aaradhya. Uses full AI pipeline.

/mode [base|calm|sass|hype]
→ Switch personality mode.
→ Saves to usrs.json per user.
→ Replies:
   base: "back to normal 😊 what's up?"
   calm: "okay, i'm here. take your time."
   sass: "alright, don't say i didn't warn you 😂"
   hype: "let's gooo — tell me something good!"

/wipe msgs:[1-100] mem:[1]
→ msgs — delete that many Discord messages
→ mem — clear chat memory for this user
→ Both can be used together
→ Defers immediately to avoid timeout

/setup [#channel]
→ Locks bot to one channel.
→ Saves channelId to conf/bott.json autoChannel.

/help
→ Lists all commands ephemerally.

/vibe
→ Shows current mode for this user.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPENROUTER INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Website: https://openrouter.ai
Keys: https://openrouter.ai/keys
Models: https://openrouter.ai/models
Base URL: https://openrouter.ai/api/v1/chat/completions
Auth: Authorization: Bearer OPENROUTER_API_KEY
Current model: nousresearch/hermes-2-pro-llama-3-8b
All config in conf/aicf.json — never hardcoded.

If model returns 429 or 404 — change model in
conf/aicf.json only. No code changes needed.

Free model alternatives:
- meta-llama/llama-3.3-70b-instruct:free
- meta-llama/llama-3.2-3b-instruct:free
- mistralai/mistral-7b-instruct:free

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAILWAY DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: railway.app
Linked to: github.com/busnishant/project-core
Auto-deploys on every git push to main.
Start command: node core/boot.js (from package.json)
No Procfile needed — Railway reads npm start.

Environment variables set in Railway dashboard:
DISCORD_TOKEN
DISCORD_CLIENT_ID
DISCORD_GUILD_ID
OPENROUTER_API_KEY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CODING RULES — NEVER BREAK THESE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ES Modules only — import/export everywhere
   Never use require()

2. All file paths must use:
   fileURLToPath(import.meta.url) + path.join()
   Never relative paths like ./

3. All interactions must defer first:
   await interaction.deferReply({ 
     flags: MessageFlags.Ephemeral 
   })
   Then use editReply() — never reply() after defer

4. Never use ephemeral: true anywhere
   Always use flags: MessageFlags.Ephemeral

5. Never hardcode tokens, keys, URLs, or model names
   Everything config lives in conf/ or .env

6. All folder and file names max 5 characters lowercase

7. Every file must have a top comment — one line,
   explains what the file does

8. Use data/logs.js for all logging — never console.log
   Format: log.info('tag', 'message')

9. Never crash the bot — all async code in try/catch

10. After any change to cmds/ — run npm run deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION PROTOCOL — DO THIS EVERY TIME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ON START:
1. Read read/maps.md — know every file status
2. Read read/next.md — know what needs doing
3. Read read/errs.md — know what is broken
4. Confirm understanding in one short paragraph

DURING WORK:
- Work through read/next.md top to bottom
- Mark files in read/maps.md as you go
- Log bugs in read/errs.md immediately
- Never move to next task until current one works

ON END:
1. Update read/done.md — what was done today
2. Update read/next.md — remove done, add new
3. Update read/maps.md — reflect file changes
4. Update read/errs.md — mark fixed bugs
5. Run: git add . && git commit -m "update" && git push
6. Write one plain English paragraph — what was
   done and what comes next, no jargon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUTURE PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase 1 — Stability (current)
- Fix all interaction timeout errors
- Fix double reply bug
- Verify all 6 commands work cleanly

Phase 2 — Knowledge base
- Fill mind/nios/ files with real NIOS data
- Fill mind/life/hlth.md with PTSD support data
- Fill mind/grow/ files over time

Phase 3 — Moderation (future)
- /clean [n] — delete messages in a channel
- /ban @user — ban with reason logged
- /kick @user — kick with reason
- /timeout @user [minutes] — temporary mute
- /slowmode [seconds] — set channel slowmode
- /lock — lock a channel
- /unlock — unlock a channel

Phase 4 — Automation (future)
- Auto-delete bot messages after X seconds
- Welcome message when new member joins
- Auto-role on join
- Scheduled messages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Last Synced
Date: 2026-03-04
Synced by: projectcore
Status: Structure clean and verified. 6 commands
registered and working. Core personality loaded.
Knowledge base files (nios/, grow/, wrld/, life/)
are empty placeholders — ready to fill in Phase 2.
Known issue: know/refs.md exists but not loaded
by tone.js — add to load order next session.