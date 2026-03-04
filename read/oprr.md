# OpenRouter Reference
> Everything projectcore needs to know about OpenRouter.
> This is the only place to look for API details on this project.

---

## What is OpenRouter

Single API that routes to hundreds of AI models from different providers.
Free tier available — no credit card needed.

- **Website:** https://openrouter.ai
- **Docs:** https://openrouter.ai/docs
- **Models:** https://openrouter.ai/models
- **API Keys:** https://openrouter.ai/keys

---

## Base URL

```
https://openrouter.ai/api/v1/chat/completions
```

Stored in `conf/aicf.json → baseUrl`. Never hardcoded in code.

---

## Authentication

```
Authorization: Bearer YOUR_OPENROUTER_API_KEY
```

Key is stored in `.env` as `OPENROUTER_API_KEY`. Never put it in code or config files.
Get your key at: https://openrouter.ai/keys — no card, just email signup.

---

## Required Headers

```
HTTP-Referer: your GitHub or project URL   ← from conf/aicf.json → siteUrl
X-Title: your project name                 ← from conf/aicf.json → siteName
```

OpenRouter uses these to identify your app in their dashboard.

---

## Free Models

| Model ID | Notes |
|---|---|
| `meta-llama/llama-3.3-70b-instruct:free` | **Default.** Best quality for chat |
| `meta-llama/llama-3.2-3b-instruct:free` | Lightest, fastest response |
| `nousresearch/hermes-3-llama-3.1-405b:free` | Best for roleplay / persona |
| `google/gemma-3-27b-it:free` | Google. Good backup option |
| `mistralai/mistral-7b-instruct:free` | Reliable fallback |

Browse all free models at: https://openrouter.ai/models (filter by **Free**)

---

## How to Switch Models

1. Open `conf/aicf.json`
2. Change the `"model"` field to any model ID from the table above
3. Save the file → `npm start` — done

No code changes needed.

---

## Where OpenRouter Is Used in This Project

| File | Role |
|---|---|
| `conf/aicf.json` | Stores `baseUrl`, `model`, `maxTokens`, `temperature`, `siteUrl`, `siteName` |
| `core/envs.js` | Validates `OPENROUTER_API_KEY` is present at startup |
| `mind/chat.js` | Makes the `fetch()` call with Authorization header |
| `mind/tone.js` | Builds the system prompt prepended as `role: "system"` message |
| `mind/memo.js` | Builds the message history array in OpenAI format |

---

## Rate Limits on Free Tier

| Limit | Value |
|---|---|
| Requests per minute | 20 |
| Requests per day per model | 200 |
| Cost | Free |
| Card required | No |

Check usage: https://openrouter.ai/activity
