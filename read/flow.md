# Data Flow
> How data moves through the bot for every command and system event.
> Read this to understand how all the pieces connect.

---

## 🚀 Bot Startup

```
npm start
  └─► core/boot.js
        ├─► core/envs.js        — loads .env, validates DISCORD_TOKEN etc.
        ├─► core/load.js
        │     ├─► disc/regs.js  — scans cmds/*.js, loads into client.commands
        │     └─► disc/evnt.js  — attaches ClientReady + InteractionCreate listeners
        └─► client.login()      — connects to Discord gateway
              └─► [ClientReady fires]
                    └─► disc/evnt.js  — logs "Logged in as <BotTag>"
```

---

## 📡 npm run deploy (slash command registration)

```
npm run deploy
  └─► core/push.js
        ├─► core/envs.js        — loads .env
        ├─► scans cmds/*.js     — collects each command's .data.toJSON()
        └─► Discord REST API    — PUT /applications/{id}/commands
              └─► logs "Commands registered ✓"
```

---

## 💬 /ping

```
User types /ping
  └─► Discord gateway
        └─► disc/evnt.js        — InteractionCreate fires
              └─► cmds/ping.js  — execute(interaction)
                    └─► interaction.reply("🏓 Pong! Latency: Xms")
```

---

## 🤖 /ask [prompt]

```
User types /ask prompt:"Hello"
  └─► Discord gateway
        └─► disc/evnt.js              — InteractionCreate fires
              └─► cmds/askk.js        — execute(interaction)
                    ├─► interaction.deferReply()
                    ├─► util/prse.js  — getOption() + sanitize() → clean string
                    ├─► mind/tone.js  — getMaskPrompt(userId)
                    │     ├─► data/stor/usrs.json  — read user's active mode
                    │     └─► mind/mask/<mode>.md  — read system prompt text
                    ├─► mind/memo.js  — getHistory(userId)
                    │     └─► data/stor/msgs.json  — read last N messages
                    ├─► mind/chat.js  — askAI(messages)
                    │     ├─► conf/aicf.json        — read model/temp/tokens
                    │     └─► fetch() → OpenRouter API → reply text
                    ├─► mind/memo.js  — pushHistory(userId, 'user', prompt)
                    ├─► mind/memo.js  — pushHistory(userId, 'assistant', reply)
                    │     └─► data/stor/msgs.json  — write updated history
                    ├─► util/frmt.js  — formatReply(reply) → string[]
                    └─► interaction.editReply(chunks[0])
                          ├─► interaction.followUp(chunks[1]) if needed
                          └─► interaction.followUp(chunks[N]) ...
```

**Error path (any step throws):**
```
error thrown
  └─► util/errs.js  — handleError(err, interaction, 'askk')
        ├─► data/logs.js  — log('error', ...)
        └─► interaction.reply / followUp → "⚠️ Something went wrong."
```

---

## 🎭 /mode [persona]

```
User types /mode persona:"sass"
  └─► Discord gateway
        └─► disc/evnt.js           — InteractionCreate fires
              └─► cmds/mode.js     — execute(interaction)
                    ├─► util/prse.js  — getOption() → "sass"
                    ├─► mind/tone.js  — setMode(userId, "sass")
                    │     └─► data/stor/usrs.json  — write updated mode
                    └─► interaction.reply("✅ Persona switched to 💅 Sass")
```

---

## 🗑️ /wipe

```
User types /wipe
  └─► Discord gateway
        └─► disc/evnt.js          — InteractionCreate fires
              └─► cmds/wipe.js    — execute(interaction)
                    ├─► mind/memo.js  — clearHistory(userId)
                    │     └─► data/stor/msgs.json  — delete user key
                    └─► interaction.reply("🗑️ History wiped." [ephemeral])
```

---

## 🗂️ Storage Read/Write

```
Read:
  caller (memo.js / tone.js / chat.js)
    └─► data/save.js — readJSON(absPath, fallback)
          └─► fs.existsSync → fs.readFileSync → JSON.parse → object

Write:
  caller (memo.js / tone.js)
    └─► data/save.js — writeJSON(absPath, data)
          └─► JSON.stringify(data, null, 2) → fs.writeFileSync
```

---

## ❌ Global Error Guards (boot.js)

```
Any unhandled promise rejection anywhere
  └─► process.on('unhandledRejection')
        └─► data/logs.js — log('error', ...) [does NOT exit]

Any uncaught synchronous exception
  └─► process.on('uncaughtException')
        └─► data/logs.js — log('error', ...) → process.exit(1)
```

---

## 📣 Mention Flow

```
User mentions @Aaradhya in any server channel
  └─► Discord gateway
        └─► disc/evnt.js         — MessageCreate fires
              ├─► author.bot?     — ignored if true
              ├─► conf/bott.json  — check replyOnMention flag
              ├─► util/frmt.js    — cleanMention() strips <@BOT_ID> from text
              ├─► message.channel.sendTyping()
              ├─► mind/tone.js    — getMaskPrompt(userId) → full system prompt
              ├─► mind/memo.js    — getHistory(userId) → past messages
              ├─► mind/chat.js    — askAI(messages) → OpenRouter → reply text
              ├─► mind/memo.js    — pushHistory(userId, 'user', text)
              ├─► mind/memo.js    — pushHistory(userId, 'assistant', reply)
              └─► message.reply(chunks[0]) [+ followUps if long]

Error path:
  └─► util/errs.js — handleMessageError() → "Arre yaar, kuch toh gadbad ho gayi 😅"
```

---

## 💬 Reply Flow

```
User replies to one of Aaradhya's messages
  └─► Discord gateway
        └─► disc/evnt.js              — MessageCreate fires
              ├─► author.bot?          — ignored if true
              ├─► message.reference?   — fetch referenced message
              ├─► referenced.author.id === botId? — confirms it's Aaradhya's message
              ├─► conf/bott.json       — check replyOnReply flag
              └─► [same AI flow as Mention from sendTyping() onward]
```

---

## 📩 DM Flow

```
User sends Aaradhya a Direct Message
  └─► Discord gateway
        └─► disc/evnt.js           — MessageCreate fires
              ├─► author.bot?       — ignored if true
              ├─► channel.type === ChannelType.DM? — confirms it's a DM
              ├─► conf/bott.json    — check replyOnDM flag
              └─► [same AI flow as Mention from sendTyping() onward]

Note: Partials.Channel + Partials.Message must be set in disc/clnt.js
      or Discord silently drops DM events before they reach evnt.js.
```

